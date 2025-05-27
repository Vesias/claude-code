export interface MCPRequest {
  action: string;
  params: Record<string, any>;
  context?: {
    user?: string;
    session?: string;
    timestamp?: Date;
  };
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    duration?: number;
    version?: string;
  };
}

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  
  execute(request: MCPRequest): Promise<MCPResponse>;
  getCapabilities(): Record<string, any>;
}