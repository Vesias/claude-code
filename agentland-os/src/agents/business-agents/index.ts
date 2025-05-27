/**
 * Deutsche Business-Agents für AgentlandOS
 * Zero-Capital AIaaS Platform mit MCP-Integration
 * 
 * Kernkonzept: Modulare, KMU-fokussierte Business-Agents mit deutscher Compliance
 */

import { z } from 'zod';
import { EventEmitter } from 'events';
import { AGUIEventStream } from '@/lib/agui-protocol';
import { MCPOrchestrator } from '@/lib/mcp-orchestrator';

// Business Agent Interface
export interface BusinessAgent {
  id: string;
  name: string;
  description: string;
  category: 'compliance' | 'finance' | 'automation' | 'research';
  requiredMCPTools: string[];
  kpis: AgentKPI[];
  
  // Lifecycle methods
  initialize(config: AgentConfig): Promise<void>;
  execute(input: AgentInput): AsyncGenerator<AgentEvent>;
  validate(input: unknown): z.ZodSchema;
  shutdown(): Promise<void>;
}

// Agent KPI Definition
export interface AgentKPI {
  name: string;
  metric: 'time_saved' | 'error_reduction' | 'cost_saved' | 'compliance_score';
  targetValue: number;
  currentValue?: number;
}

// Agent Configuration
export interface AgentConfig {
  tenantId: string;
  workspaceId: string;
  locale: 'de-DE' | 'en-US';
  mcpTools: MCPToolConfig[];
  apiKeys: Record<string, string>;
}

// MCP Tool Configuration
export interface MCPToolConfig {
  name: string;
  endpoint: string;
  containerized: boolean;
  resourceLimits?: {
    memory: string;
    cpu: string;
  };
}

// Agent Input/Output Types
export interface AgentInput {
  action: string;
  data: Record<string, unknown>;
  context?: {
    userId: string;
    sessionId: string;
    previousActions?: string[];
  };
}

// AG-UI Compatible Event Types
export type AgentEvent = 
  | { type: 'TEXT_MESSAGE_START'; payload: { message: string } }
  | { type: 'TEXT_MESSAGE_CHUNK'; payload: { chunk: string } }
  | { type: 'TOOL_CALL_START'; payload: { tool: string; params: unknown } }
  | { type: 'TOOL_CALL_END'; payload: { tool: string; result: unknown } }
  | { type: 'STATE_UPDATE'; payload: { state: Record<string, unknown> } }
  | { type: 'KPI_UPDATE'; payload: { kpi: string; value: number } }
  | { type: 'ERROR'; payload: { error: string; details?: unknown } };

// Base Business Agent Class
export abstract class BaseBusinessAgent extends EventEmitter implements BusinessAgent {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract category: 'compliance' | 'finance' | 'automation' | 'research';
  abstract requiredMCPTools: string[];
  abstract kpis: AgentKPI[];
  
  protected config?: AgentConfig;
  protected mcpOrchestrator?: MCPOrchestrator;
  protected agui?: AGUIEventStream;
  
  async initialize(config: AgentConfig): Promise<void> {
    this.config = config;
    
    // Initialize MCP Orchestrator
    this.mcpOrchestrator = new MCPOrchestrator({
      tenantId: config.tenantId,
      tools: config.mcpTools
    });
    
    // Initialize AG-UI Stream
    this.agui = new AGUIEventStream();
    
    // Validate required tools
    const availableTools = config.mcpTools.map(t => t.name);
    const missingTools = this.requiredMCPTools.filter(
      tool => !availableTools.includes(tool)
    );
    
    if (missingTools.length > 0) {
      throw new Error(`Missing required MCP tools: ${missingTools.join(', ')}`);
    }
    
    await this.onInitialize();
  }
  
  abstract execute(input: AgentInput): AsyncGenerator<AgentEvent>;
  abstract validate(input: unknown): z.ZodSchema;
  
  protected abstract onInitialize(): Promise<void>;
  
  async shutdown(): Promise<void> {
    await this.mcpOrchestrator?.shutdown();
    this.removeAllListeners();
  }
  
  // Helper method for KPI tracking
  protected updateKPI(name: string, value: number): void {
    const kpi = this.kpis.find(k => k.name === name);
    if (kpi) {
      kpi.currentValue = value;
      this.emit('kpi:update', { agent: this.id, kpi: name, value });
    }
  }
  
  // Helper method for secure tool execution
  protected async executeMCPTool<T>(
    toolName: string, 
    action: string, 
    params: unknown
  ): Promise<T> {
    if (!this.mcpOrchestrator) {
      throw new Error('MCP Orchestrator not initialized');
    }
    
    return this.mcpOrchestrator.execute<T>(toolName, action, params);
  }
}

// Export all agent implementations
export * from './dsgvo-compliance-agent';
export * from './gobd-checklist-agent';
export * from './invoice-processing-agent';
export * from './funding-scout-agent';

// Agent Registry
export class BusinessAgentRegistry {
  private static agents = new Map<string, typeof BaseBusinessAgent>();
  
  static register(agentClass: typeof BaseBusinessAgent): void {
    const instance = new (agentClass as any)();
    this.agents.set(instance.id, agentClass);
  }
  
  static get(id: string): typeof BaseBusinessAgent | undefined {
    return this.agents.get(id);
  }
  
  static list(): Array<{ id: string; name: string; description: string }> {
    return Array.from(this.agents.values()).map(AgentClass => {
      const instance = new (AgentClass as any)();
      return {
        id: instance.id,
        name: instance.name,
        description: instance.description
      };
    });
  }
}
