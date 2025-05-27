// Agent-related types

export interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  capabilities: string[]
  configuration: AgentConfig
  status: AgentStatus
  workspaceId: string
  createdAt: Date
  updatedAt: Date
}

export enum AgentType {
  AI_TOOL = 'AI_TOOL',
  MCP_TOOL = 'MCP_TOOL',
  CUSTOM = 'CUSTOM',
  SYSTEM = 'SYSTEM',
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
}

export interface AgentConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  tools?: string[]
  endpoints?: {
    execute: string
    status: string
    config: string
  }
}

export interface AgentExecution {
  id: string
  agentId: string
  workspaceId: string
  userId: string
  input: any
  output: any
  status: ExecutionStatus
  duration: number // milliseconds
  tokensUsed?: number
  error?: string
  startedAt: Date
  completedAt?: Date
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}