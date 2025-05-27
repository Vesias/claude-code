export enum EventType {
  SYSTEM = 'system',
  USER = 'user',
  APP = 'app',
  AGENT = 'agent',
  FILE = 'file',
  NETWORK = 'network',
  SECURITY = 'security',
  PERFORMANCE = 'performance'
}

export enum EventLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  DEBUG = 'debug'
}

export interface AGEvent {
  id: string;
  timestamp: number;
  type: EventType;
  level: EventLevel;
  source: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  user?: string;
  sessionId?: string;
  duration?: number;
  progress?: number;
}

export interface SystemEvent extends AGEvent {
  type: EventType.SYSTEM;
  systemInfo?: {
    cpu?: number;
    memory?: number;
    disk?: number;
    network?: {
      upload: number;
      download: number;
    };
  };
}

export interface UserEvent extends AGEvent {
  type: EventType.USER;
  action: string;
  target?: string;
  coordinates?: { x: number; y: number };
}

export interface AppEvent extends AGEvent {
  type: EventType.APP;
  appId: string;
  appName: string;
  action: 'launch' | 'close' | 'minimize' | 'maximize' | 'focus' | 'error';
  window?: {
    id: string;
    title: string;
    bounds?: { x: number; y: number; width: number; height: number };
  };
}

export interface FileEvent extends AGEvent {
  type: EventType.FILE;
  action: 'create' | 'modify' | 'delete' | 'move' | 'copy' | 'open' | 'close';
  path: string;
  size?: number;
  mimeType?: string;
  previousPath?: string;
}

export interface NetworkEvent extends AGEvent {
  type: EventType.NETWORK;
  protocol: 'http' | 'https' | 'ws' | 'wss' | 'tcp' | 'udp';
  method?: string;
  url?: string;
  status?: number;
  bytes?: {
    sent: number;
    received: number;
  };
  latency?: number;
}

export interface SecurityEvent extends AGEvent {
  type: EventType.SECURITY;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threat?: string;
  action?: 'blocked' | 'allowed' | 'quarantined' | 'detected';
  details?: Record<string, any>;
}

export interface PerformanceEvent extends AGEvent {
  type: EventType.PERFORMANCE;
  metric: string;
  value: number;
  unit?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export type AnyAGEvent = 
  | SystemEvent 
  | UserEvent 
  | AppEvent 
  | FileEvent 
  | NetworkEvent 
  | SecurityEvent 
  | PerformanceEvent;

// Event filters
export interface EventFilter {
  types?: EventType[];
  levels?: EventLevel[];
  sources?: string[];
  tags?: string[];
  search?: string;
  startTime?: number;
  endTime?: number;
}

// Event statistics
export interface EventStats {
  total: number;
  byType: Record<EventType, number>;
  byLevel: Record<EventLevel, number>;
  bySource: Record<string, number>;
  recentRate: number; // events per second
}

// Helper functions
export function createEvent(
  type: EventType,
  level: EventLevel,
  source: string,
  title: string,
  extras?: Partial<AGEvent>
): AGEvent {
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type,
    level,
    source,
    title,
    ...extras
  };
}

export function getEventIcon(type: EventType): string {
  const icons: Record<EventType, string> = {
    [EventType.SYSTEM]: '⚙️',
    [EventType.USER]: '👤',
    [EventType.APP]: '📱',
    [EventType.AGENT]: '🤖',
    [EventType.FILE]: '📁',
    [EventType.NETWORK]: '🌐',
    [EventType.SECURITY]: '🔒',
    [EventType.PERFORMANCE]: '📊'
  };
  return icons[type] || '📌';
}

export function getEventColor(level: EventLevel): string {
  const colors: Record<EventLevel, string> = {
    [EventLevel.INFO]: '#3b82f6',
    [EventLevel.WARNING]: '#f59e0b',
    [EventLevel.ERROR]: '#ef4444',
    [EventLevel.SUCCESS]: '#10b981',
    [EventLevel.DEBUG]: '#6b7280'
  };
  return colors[level] || '#6b7280';
}