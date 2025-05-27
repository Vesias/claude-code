'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventStream } from '@/hooks/use-event-stream';
import { 
  AnyAGEvent, 
  EventType, 
  EventLevel, 
  getEventIcon, 
  getEventColor,
  EventFilter 
} from '@/lib/realtime/event-types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Filter, Search, X, Maximize2, Minimize2 } from 'lucide-react';

interface EventStreamProps {
  className?: string;
  maxEvents?: number;
  autoScroll?: boolean;
}

export function EventStream({ 
  className, 
  maxEvents = 100,
  autoScroll = true 
}: EventStreamProps) {
  const [filter, setFilter] = useState<EventFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<EventLevel | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { events, stats, clearEvents, isConnected } = useEventStream({
    filter,
    maxEvents,
    paused: isPaused
  });

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (autoScroll && !isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, autoScroll, isPaused]);

  // Update filters
  useEffect(() => {
    const newFilter: EventFilter = {};
    
    if (searchTerm) {
      newFilter.search = searchTerm;
    }
    
    if (selectedType !== 'all') {
      newFilter.types = [selectedType];
    }
    
    if (selectedLevel !== 'all') {
      newFilter.levels = [selectedLevel];
    }
    
    setFilter(newFilter);
  }, [searchTerm, selectedType, selectedLevel]);

  const filteredEvents = events.filter(event => {
    if (filter.search && !event.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !event.description?.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.types && !filter.types.includes(event.type)) {
      return false;
    }
    if (filter.levels && !filter.levels.includes(event.level)) {
      return false;
    }
    return true;
  });

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300',
      isExpanded ? 'h-[600px]' : 'h-[400px]',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <Activity className={cn(
            "w-5 h-5",
            isConnected ? "text-green-500 animate-pulse" : "text-gray-400"
          )} />
          <h3 className="font-semibold">Event Stream</h3>
          <Badge variant="outline" className="text-xs">
            {stats.total} events
          </Badge>
          {stats.recentRate > 0 && (
            <Badge variant="secondary" className="text-xs">
              {stats.recentRate.toFixed(1)}/s
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearEvents}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
          
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as EventType | 'all')}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(EventType).map(type => (
                <SelectItem key={type} value={type}>
                  {getEventIcon(type)} {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as EventLevel | 'all')}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {Object.values(EventLevel).map(level => (
                <SelectItem key={level} value={level}>
                  <span style={{ color: getEventColor(level) }}>• {level}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event List */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="p-2">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </AnimatePresence>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {events.length === 0 ? 'No events yet' : 'No events match filters'}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/95 backdrop-blur border-t">
        <div className="flex gap-4 text-xs text-muted-foreground">
          {Object.entries(stats.byType).map(([type, count]) => (
            count > 0 && (
              <div key={type} className="flex items-center gap-1">
                <span>{getEventIcon(type as EventType)}</span>
                <span>{count}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </Card>
  );
}

interface EventItemProps {
  event: AnyAGEvent;
}

function EventItem({ event }: EventItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        "mb-2 p-3 rounded-lg border bg-card cursor-pointer transition-colors",
        "hover:bg-accent/50",
        isExpanded && "bg-accent/50"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div 
          className="mt-0.5 text-lg"
          style={{ color: getEventColor(event.level) }}
        >
          {getEventIcon(event.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm truncate">{event.title}</span>
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: getEventColor(event.level),
                color: getEventColor(event.level)
              }}
            >
              {event.level}
            </Badge>
          </div>
          
          {event.description && (
            <p className="text-xs text-muted-foreground truncate">
              {event.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{event.source}</span>
            <span>•</span>
            <span>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
            {event.duration && (
              <>
                <span>•</span>
                <span>{event.duration}ms</span>
              </>
            )}
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && event.metadata && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t"
              >
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
                {event.tags && event.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {event.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}