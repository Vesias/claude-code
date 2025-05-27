// Event streaming types for AG-UI

export interface AGUIEvent {
  id: string
  type: EventType
  source: EventSource
  timestamp: Date
  workspaceId: string
  userId?: string
  data: any
  metadata?: EventMetadata
}

export enum EventType {
  // Agent events
  AGENT_STARTED = 'AGENT_STARTED',
  AGENT_COMPLETED = 'AGENT_COMPLETED',
  AGENT_FAILED = 'AGENT_FAILED',
  AGENT_PROGRESS = 'AGENT_PROGRESS',
  
  // MCP tool events
  MCP_TOOL_STARTED = 'MCP_TOOL_STARTED',
  MCP_TOOL_OUTPUT = 'MCP_TOOL_OUTPUT',
  MCP_TOOL_COMPLETED = 'MCP_TOOL_COMPLETED',
  MCP_TOOL_ERROR = 'MCP_TOOL_ERROR',
  
  // System events
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  SYSTEM_HEALTH = 'SYSTEM_HEALTH',
  SYSTEM_METRIC = 'SYSTEM_METRIC',
  
  // Business events
  CUSTOMER_ADDED = 'CUSTOMER_ADDED',
  CUSTOMER_UPDATED = 'CUSTOMER_UPDATED',
  PIPELINE_CHANGED = 'PIPELINE_CHANGED',
  
  // Neural consciousness events
  NEURAL_SYNC = 'NEURAL_SYNC',
  NEURAL_THOUGHT = 'NEURAL_THOUGHT',
  NEURAL_DECISION = 'NEURAL_DECISION',
}

export interface EventSource {
  service: string
  instance?: string
  version?: string
}

export interface EventMetadata {
  correlationId?: string
  causationId?: string
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
}

// Event stream connection
export interface EventStreamConfig {
  url: string
  workspaceId: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  filters?: EventFilter[]
}

export interface EventFilter {
  types?: EventType[]
  sources?: string[]
  tags?: string[]
}

// Event handlers
export type EventHandler = (event: AGUIEvent) => void | Promise<void>

export interface EventSubscription {
  id: string
  filter?: EventFilter
  handler: EventHandler
  unsubscribe: () => void
}