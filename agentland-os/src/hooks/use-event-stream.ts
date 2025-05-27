'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { socketClient } from '@/lib/realtime/socket-client';
import { 
  AnyAGEvent, 
  EventFilter, 
  EventStats, 
  EventType, 
  EventLevel 
} from '@/lib/realtime/event-types';

interface UseEventStreamOptions {
  filter?: EventFilter;
  maxEvents?: number;
  autoConnect?: boolean;
  paused?: boolean;
}

interface UseEventStreamReturn {
  events: AnyAGEvent[];
  stats: EventStats;
  isConnected: boolean;
  isPaused: boolean;
  connect: () => void;
  disconnect: () => void;
  clearEvents: () => void;
  pause: () => void;
  resume: () => void;
}

export function useEventStream({
  filter = {},
  maxEvents = 1000,
  autoConnect = true,
  paused = false
}: UseEventStreamOptions = {}): UseEventStreamReturn {
  const [events, setEvents] = useState<AnyAGEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(paused);
  const eventsRef = useRef<AnyAGEvent[]>([]);
  const statsRef = useRef<EventStats>(getInitialStats());
  const recentEventsTimestamps = useRef<number[]>([]);

  // Calculate stats
  const updateStats = useCallback((newEvent?: AnyAGEvent) => {
    if (newEvent) {
      statsRef.current.total++;
      statsRef.current.byType[newEvent.type] = (statsRef.current.byType[newEvent.type] || 0) + 1;
      statsRef.current.byLevel[newEvent.level] = (statsRef.current.byLevel[newEvent.level] || 0) + 1;
      statsRef.current.bySource[newEvent.source] = (statsRef.current.bySource[newEvent.source] || 0) + 1;
      
      // Track recent events for rate calculation
      const now = Date.now();
      recentEventsTimestamps.current.push(now);
      
      // Keep only events from last 5 seconds
      const fiveSecondsAgo = now - 5000;
      recentEventsTimestamps.current = recentEventsTimestamps.current.filter(t => t > fiveSecondsAgo);
      
      // Calculate rate
      statsRef.current.recentRate = recentEventsTimestamps.current.length / 5;
    }
  }, []);

  // Event handler
  const handleEvent = useCallback((event: AnyAGEvent) => {
    if (isPaused) return;
    
    // Apply filters
    if (filter.types && !filter.types.includes(event.type)) return;
    if (filter.levels && !filter.levels.includes(event.level)) return;
    if (filter.sources && !filter.sources.includes(event.source)) return;
    if (filter.tags && !event.tags?.some(tag => filter.tags?.includes(tag))) return;
    if (filter.startTime && event.timestamp < filter.startTime) return;
    if (filter.endTime && event.timestamp > filter.endTime) return;
    
    // Update stats
    updateStats(event);
    
    // Add event to list
    setEvents(prev => {
      const newEvents = [event, ...prev];
      // Trim to max events
      if (newEvents.length > maxEvents) {
        newEvents.length = maxEvents;
      }
      eventsRef.current = newEvents;
      return newEvents;
    });
  }, [filter, maxEvents, isPaused, updateStats]);

  // Socket event handlers
  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleAGEvent = (data: AnyAGEvent) => handleEvent(data);
    const handleSystemEvent = (data: AnyAGEvent) => handleEvent({ ...data, type: EventType.SYSTEM });
    const handleUserEvent = (data: AnyAGEvent) => handleEvent({ ...data, type: EventType.USER });
    const handleAppEvent = (data: AnyAGEvent) => handleEvent({ ...data, type: EventType.APP });

    socketClient.on('connected', handleConnected);
    socketClient.on('disconnected', handleDisconnected);
    socketClient.on('ag-event', handleAGEvent);
    socketClient.on('system-event', handleSystemEvent);
    socketClient.on('user-event', handleUserEvent);
    socketClient.on('app-event', handleAppEvent);

    // Auto-connect
    if (autoConnect && !socketClient.isConnected) {
      socketClient.connect();
    }

    return () => {
      socketClient.off('connected', handleConnected);
      socketClient.off('disconnected', handleDisconnected);
      socketClient.off('ag-event', handleAGEvent);
      socketClient.off('system-event', handleSystemEvent);
      socketClient.off('user-event', handleUserEvent);
      socketClient.off('app-event', handleAppEvent);
    };
  }, [autoConnect, handleEvent]);

  // Update paused state
  useEffect(() => {
    setIsPaused(paused);
  }, [paused]);

  // API methods
  const connect = useCallback(() => {
    socketClient.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketClient.disconnect();
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    eventsRef.current = [];
    statsRef.current = getInitialStats();
    recentEventsTimestamps.current = [];
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    events,
    stats: statsRef.current,
    isConnected,
    isPaused,
    connect,
    disconnect,
    clearEvents,
    pause,
    resume
  };
}

// Helper function to get initial stats
function getInitialStats(): EventStats {
  return {
    total: 0,
    byType: Object.values(EventType).reduce((acc, type) => ({ ...acc, [type]: 0 }), {}) as Record<EventType, number>,
    byLevel: Object.values(EventLevel).reduce((acc, level) => ({ ...acc, [level]: 0 }), {}) as Record<EventLevel, number>,
    bySource: {},
    recentRate: 0
  };
}

// Hook to emit events
export function useEventEmitter() {
  const emit = useCallback((event: Partial<AnyAGEvent> & { type: EventType; title: string }) => {
    socketClient.emit('user-action', {
      ...event,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    });
  }, []);

  return { emit };
}