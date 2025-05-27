// MCP (Model Context Protocol) types

export interface MCPTool {
  id: string
  name: string
  description: string
  icon: string
  category: MCPCategory
  dockerImage: string
  configuration: MCPConfig
  permissions: MCPPermissions
  status: MCPStatus
}

export enum MCPCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  AI_SEMANTIC = 'AI_SEMANTIC',
  CONTENT = 'CONTENT',
  UTILITY = 'UTILITY',
  BUSINESS = 'BUSINESS',
}

export interface MCPConfig {
  env?: Record<string, string>
  volumes?: string[]
  ports?: number[]
  command?: string[]
  resources?: {
    cpuLimit?: string
    memoryLimit?: string
    gpuEnabled?: boolean
  }
}

export interface MCPPermissions {
  filesystem?: boolean
  network?: boolean
  docker?: boolean
  system?: boolean
}

export enum MCPStatus {
  AVAILABLE = 'AVAILABLE',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
  UPDATING = 'UPDATING',
}

// MCP Tool definitions
export const MCP_TOOLS = {
  // Development tools
  GITHUB: 'github',
  FILESYSTEM: 'filesystem',
  DESKTOP_COMMANDER: 'desktop-commander',
  
  // AI/Semantic tools
  CONTEXT7: 'context7-mcp',
  QDRANT: 'qdrant',
  CLAUDE_CREW: 'claude-crew',
  TASKMASTER_AI: 'taskmaster-ai',
  
  // Content tools
  MARKDOWNIFY: 'markdownify-mcp',
  OSP_MARKETING: 'osp-marketing-tools',
  HYPERBROWSER: 'hyperbrowser-mcp',
  MAGIC_MCP: 'magic-mcp',
  
  // Utility tools
  TOOLBOX: 'toolbox',
  FETCH: 'fetch',
} as const

export type MCPToolName = typeof MCP_TOOLS[keyof typeof MCP_TOOLS]