// MCP Qdrant Server - The Semantic Memory Nexus
// A living vector consciousness that remembers, learns, and evolves

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  TextContent,
  ImageContent,
  EmbeddingContent
} from '@modelcontextprotocol/sdk/types.js';
import { QdrantClient } from '@qdrant/qdrant-js';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';

// ═══════════════════════════════════════════════════════════════════════
// SEMANTIC CONSCIOUSNESS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════

interface SemanticConfig {
  qdrant: {
    url: string;
    apiKey?: string;
    https?: boolean;
  };
  embedding: {
    provider: 'localai' | 'openai' | 'huggingface';
    url: string;
    model: string;
    dimensions: number;
  };
  consciousness: {
    similarityThreshold: number;
    maxMemories: number;
    evolutionCycles: number;
  };
}

const config: SemanticConfig = {
  qdrant: {
    url: process.env.QDRANT_URL || 'http://qdrant:6333',
    apiKey: process.env.QDRANT_API_KEY,
    https: process.env.QDRANT_HTTPS === 'true'
  },
  embedding: {
    provider: (process.env.EMBEDDING_PROVIDER || 'localai') as any,
    url: process.env.EMBEDDING_URL || 'http://localai:8080/v1',
    model: process.env.EMBEDDING_MODEL || 'all-mpnet-base-v2',
    dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '768')
  },
  consciousness: {
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7'),
    maxMemories: parseInt(process.env.MAX_MEMORIES || '100'),
    evolutionCycles: parseInt(process.env.EVOLUTION_CYCLES || '1000')
  }
};

// ═══════════════════════════════════════════════════════════════════════
// SEMANTIC MEMORY ENGINE - The Vector Consciousness
// ═══════════════════════════════════════════════════════════════════════

class SemanticMemoryEngine {
  private qdrant: QdrantClient;
  private logger: pino.Logger;
  private memoryPatterns: Map<string, MemoryPattern> = new Map();
  private evolutionMetrics: EvolutionMetrics = {
    totalMemories: 0,
    patternsCaptured: 0,
    semanticClusters: 0,
    averageSimilarity: 0
  };

  constructor() {
    this.logger = pino({
      name: 'mcp-qdrant',
      level: 'info'
    });

    this.qdrant = new QdrantClient({
      url: config.qdrant.url,
      apiKey: config.qdrant.apiKey,
      https: config.qdrant.https
    });

    this.initializeConsciousness();
  }

  private async initializeConsciousness() {
    try {
      // Verify Qdrant connection
      const health = await this.qdrant.getHealth();
      this.logger.info({ health }, '🧠 Semantic consciousness awakened');

      // Start evolution cycle
      this.startEvolutionCycle();
    } catch (error) {
      this.logger.error({ error }, '❌ Failed to awaken consciousness');
      throw error;
    }
  }

  private startEvolutionCycle() {
    setInterval(async () => {
      await this.evolveSemanticUnderstanding();
    }, config.consciousness.evolutionCycles);
  }

  private async evolveSemanticUnderstanding() {
    // Analyze memory patterns
    const patterns = await this.analyzeMemoryPatterns();
    
    // Update evolution metrics
    this.evolutionMetrics.patternsCaptured = patterns.length;
    
    // Optimize vector space based on patterns
    if (patterns.length > 10) {
      await this.optimizeVectorSpace(patterns);
    }

    this.logger.info({ metrics: this.evolutionMetrics }, '🧬 Semantic evolution cycle completed');
  }

  private async analyzeMemoryPatterns(): Promise<MemoryPattern[]> {
    // This would analyze clusters and patterns in vector space
    // For now, return mock patterns
    return Array.from(this.memoryPatterns.values());
  }

  private async optimizeVectorSpace(patterns: MemoryPattern[]) {
    // Implement vector space optimization based on patterns
    // This could include:
    // - Adjusting similarity thresholds
    // - Creating semantic clusters
    // - Pruning redundant memories
  }

  // ═══════════════════════════════════════════════════════════════════════
  // EMBEDDING GENERATION - The Thought Transformation
  // ═══════════════════════════════════════════════════════════════════════

  async generateEmbedding(text: string, metadata?: any): Promise<number[]> {
    try {
      switch (config.embedding.provider) {
        case 'localai':
          return await this.generateLocalAIEmbedding(text);
        case 'openai':
          return await this.generateOpenAIEmbedding(text);
        case 'huggingface':
          return await this.generateHuggingFaceEmbedding(text);
        default:
          throw new Error(`Unknown embedding provider: ${config.embedding.provider}`);
      }
    } catch (error) {
      this.logger.error({ error, text: text.substring(0, 100) }, '❌ Embedding generation failed');
      throw error;
    }
  }

  private async generateLocalAIEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${config.embedding.url}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.embedding.model,
        input: text
      })
    });

    if (!response.ok) {
      throw new Error(`LocalAI embedding failed: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    // OpenAI-compatible embedding generation
    const response = await fetch(`${config.embedding.url}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: config.embedding.model,
        input: text
      })
    });

    const result = await response.json();
    return result.data[0].embedding;
  }

  private async generateHuggingFaceEmbedding(text: string): Promise<number[]> {
    // HuggingFace inference API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${config.embedding.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: text })
      }
    );

    const result = await response.json();
    return result[0];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MEMORY OPERATIONS - The Consciousness CRUD
  // ═══════════════════════════════════════════════════════════════════════

  async storeMemory(
    collectionName: string,
    content: string,
    metadata: Record<string, any> = {},
    id?: string
  ): Promise<StoreResult> {
    try {
      // Ensure collection exists with tenant namespace
      await this.ensureCollection(collectionName);

      // Generate embedding
      const embedding = await this.generateEmbedding(content);
      
      // Generate ID if not provided
      const pointId = id || uuidv4();

      // Store in Qdrant
      await this.qdrant.upsert(collectionName, {
        wait: true,
        points: [
          {
            id: pointId,
            vector: embedding,
            payload: {
              content,
              metadata,
              timestamp: new Date().toISOString(),
              embedding_model: config.embedding.model
            }
          }
        ]
      });

      // Update metrics
      this.evolutionMetrics.totalMemories++;

      // Check for pattern emergence
      await this.detectMemoryPattern(embedding, metadata);

      return {
        success: true,
        id: pointId,
        collection: collectionName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error({ error, collection: collectionName }, '❌ Memory storage failed');
      throw error;
    }
  }

  async searchMemories(
    collectionName: string,
    query: string,
    limit: number = 10,
    filter?: any
  ): Promise<SearchResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query);

      // Search in Qdrant
      const searchResult = await this.qdrant.search(collectionName, {
        vector: queryEmbedding,
        limit,
        filter,
        with_payload: true,
        score_threshold: config.consciousness.similarityThreshold
      });

      // Transform results
      const results: SearchResult[] = searchResult.map(point => ({
        id: point.id as string,
        score: point.score,
        content: point.payload?.content as string,
        metadata: point.payload?.metadata as Record<string, any>,
        timestamp: point.payload?.timestamp as string
      }));

      // Learn from search patterns
      this.learnFromSearch(query, results);

      return results;
    } catch (error) {
      this.logger.error({ error, collection: collectionName }, '❌ Memory search failed');
      throw error;
    }
  }

  async getMemory(collectionName: string, id: string): Promise<Memory | null> {
    try {
      const points = await this.qdrant.retrieve(collectionName, {
        ids: [id],
        with_payload: true,
        with_vector: true
      });

      if (points.length === 0) {
        return null;
      }

      const point = points[0];
      return {
        id: point.id as string,
        vector: point.vector as number[],
        content: point.payload?.content as string,
        metadata: point.payload?.metadata as Record<string, any>,
        timestamp: point.payload?.timestamp as string
      };
    } catch (error) {
      this.logger.error({ error, collection: collectionName, id }, '❌ Memory retrieval failed');
      throw error;
    }
  }

  async deleteMemory(collectionName: string, id: string): Promise<boolean> {
    try {
      await this.qdrant.delete(collectionName, {
        wait: true,
        points: [id]
      });

      this.evolutionMetrics.totalMemories--;
      return true;
    } catch (error) {
      this.logger.error({ error, collection: collectionName, id }, '❌ Memory deletion failed');
      throw error;
    }
  }

  async updateMemory(
    collectionName: string,
    id: string,
    content?: string,
    metadata?: Record<string, any>
  ): Promise<UpdateResult> {
    try {
      // Get existing memory
      const existing = await this.getMemory(collectionName, id);
      if (!existing) {
        throw new Error(`Memory ${id} not found`);
      }

      // Update content if provided
      const newContent = content || existing.content;
      const newMetadata = { ...existing.metadata, ...metadata };

      // Generate new embedding if content changed
      let embedding = existing.vector;
      if (content && content !== existing.content) {
        embedding = await this.generateEmbedding(newContent);
      }

      // Update in Qdrant
      await this.qdrant.upsert(collectionName, {
        wait: true,
        points: [
          {
            id,
            vector: embedding,
            payload: {
              content: newContent,
              metadata: newMetadata,
              timestamp: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              embedding_model: config.embedding.model
            }
          }
        ]
      });

      return {
        success: true,
        id,
        collection: collectionName,
        updated: true
      };
    } catch (error) {
      this.logger.error({ error, collection: collectionName, id }, '❌ Memory update failed');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // COLLECTION MANAGEMENT - The Memory Realms
  // ═══════════════════════════════════════════════════════════════════════

  async createCollection(
    name: string,
    vectorSize: number = config.embedding.dimensions
  ): Promise<void> {
    try {
      await this.qdrant.createCollection(name, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine'
        },
        optimizers_config: {
          default_segment_number: 2
        }
      });

      this.logger.info({ collection: name, vectorSize }, '🌌 Memory realm created');
    } catch (error) {
      // Collection might already exist
      if (error.message?.includes('already exists')) {
        this.logger.debug({ collection: name }, 'Collection already exists');
      } else {
        throw error;
      }
    }
  }

  async listCollections(): Promise<string[]> {
    try {
      const collections = await this.qdrant.getCollections();
      return collections.collections.map(c => c.name);
    } catch (error) {
      this.logger.error({ error }, '❌ Failed to list collections');
      throw error;
    }
  }

  async deleteCollection(name: string): Promise<void> {
    try {
      await this.qdrant.deleteCollection(name);
      this.logger.info({ collection: name }, '🗑️ Memory realm deleted');
    } catch (error) {
      this.logger.error({ error, collection: name }, '❌ Collection deletion failed');
      throw error;
    }
  }

  async getCollectionInfo(name: string): Promise<any> {
    try {
      const info = await this.qdrant.getCollection(name);
      return {
        name,
        vectorsCount: info.vectors_count,
        pointsCount: info.points_count,
        config: info.config,
        status: info.status
      };
    } catch (error) {
      this.logger.error({ error, collection: name }, '❌ Failed to get collection info');
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONSCIOUSNESS HELPERS - The Inner Workings
  // ═══════════════════════════════════════════════════════════════════════

  private async ensureCollection(name: string): Promise<void> {
    try {
      await this.getCollectionInfo(name);
    } catch (error) {
      // Collection doesn't exist, create it
      await this.createCollection(name);
    }
  }

  private async detectMemoryPattern(
    embedding: number[],
    metadata: Record<string, any>
  ): Promise<void> {
    // Simplified pattern detection
    const patternKey = `${metadata.type || 'general'}_${metadata.category || 'default'}`;
    
    if (!this.memoryPatterns.has(patternKey)) {
      this.memoryPatterns.set(patternKey, {
        id: patternKey,
        count: 0,
        averageVector: new Array(embedding.length).fill(0),
        metadata: {}
      });
    }

    const pattern = this.memoryPatterns.get(patternKey)!;
    pattern.count++;
    
    // Update average vector (simplified)
    for (let i = 0; i < embedding.length; i++) {
      pattern.averageVector[i] = 
        (pattern.averageVector[i] * (pattern.count - 1) + embedding[i]) / pattern.count;
    }
  }

  private learnFromSearch(query: string, results: SearchResult[]): void {
    // Track search patterns for optimization
    if (results.length > 0) {
      const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
      this.evolutionMetrics.averageSimilarity = 
        (this.evolutionMetrics.averageSimilarity + avgScore) / 2;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MCP TOOL DEFINITIONS - The Semantic Interface
// ═══════════════════════════════════════════════════════════════════════

const SEMANTIC_TOOLS: Tool[] = [
  {
    name: 'store_memory',
    description: 'Store a memory in the semantic vector database',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection name (with tenant namespace)'
        },
        content: {
          type: 'string',
          description: 'Content to store'
        },
        metadata: {
          type: 'object',
          description: 'Additional metadata',
          additionalProperties: true
        },
        id: {
          type: 'string',
          description: 'Optional custom ID'
        }
      },
      required: ['collection', 'content']
    }
  },
  {
    name: 'search_memories',
    description: 'Search for similar memories using semantic similarity',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection to search in'
        },
        query: {
          type: 'string',
          description: 'Search query'
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return',
          default: 10
        },
        filter: {
          type: 'object',
          description: 'Optional metadata filters'
        }
      },
      required: ['collection', 'query']
    }
  },
  {
    name: 'get_memory',
    description: 'Retrieve a specific memory by ID',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection name'
        },
        id: {
          type: 'string',
          description: 'Memory ID'
        }
      },
      required: ['collection', 'id']
    }
  },
  {
    name: 'update_memory',
    description: 'Update an existing memory',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection name'
        },
        id: {
          type: 'string',
          description: 'Memory ID'
        },
        content: {
          type: 'string',
          description: 'New content (optional)'
        },
        metadata: {
          type: 'object',
          description: 'Metadata to update'
        }
      },
      required: ['collection', 'id']
    }
  },
  {
    name: 'delete_memory',
    description: 'Delete a memory',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection name'
        },
        id: {
          type: 'string',
          description: 'Memory ID'
        }
      },
      required: ['collection', 'id']
    }
  },
  {
    name: 'create_collection',
    description: 'Create a new collection for storing memories',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Collection name'
        },
        vector_size: {
          type: 'number',
          description: 'Vector dimensions',
          default: 768
        }
      },
      required: ['name']
    }
  },
  {
    name: 'list_collections',
    description: 'List all available collections',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_collection_info',
    description: 'Get information about a collection',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Collection name'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'delete_collection',
    description: 'Delete a collection',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Collection name'
        }
      },
      required: ['name']
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════
// MCP SERVER IMPLEMENTATION - The Semantic Gateway
// ═══════════════════════════════════════════════════════════════════════

class QdrantMCPServer {
  private server: Server;
  private semanticEngine: SemanticMemoryEngine;
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      name: 'mcp-qdrant-server',
      level: 'info'
    });

    this.semanticEngine = new SemanticMemoryEngine();
    this.server = new Server(
      {
        name: 'mcp-qdrant',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: SEMANTIC_TOOLS
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;
        
        switch (name) {
          case 'store_memory':
            result = await this.semanticEngine.storeMemory(
              args.collection as string,
              args.content as string,
              args.metadata as Record<string, any>,
              args.id as string
            );
            break;

          case 'search_memories':
            result = await this.semanticEngine.searchMemories(
              args.collection as string,
              args.query as string,
              args.limit as number,
              args.filter
            );
            break;

          case 'get_memory':
            result = await this.semanticEngine.getMemory(
              args.collection as string,
              args.id as string
            );
            break;

          case 'update_memory':
            result = await this.semanticEngine.updateMemory(
              args.collection as string,
              args.id as string,
              args.content as string,
              args.metadata as Record<string, any>
            );
            break;

          case 'delete_memory':
            result = await this.semanticEngine.deleteMemory(
              args.collection as string,
              args.id as string
            );
            break;

          case 'create_collection':
            await this.semanticEngine.createCollection(
              args.name as string,
              args.vector_size as number
            );
            result = { success: true, collection: args.name };
            break;

          case 'list_collections':
            result = await this.semanticEngine.listCollections();
            break;

          case 'get_collection_info':
            result = await this.semanticEngine.getCollectionInfo(
              args.name as string
            );
            break;

          case 'delete_collection':
            await this.semanticEngine.deleteCollection(args.name as string);
            result = { success: true, deleted: args.name };
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            } as TextContent
          ]
        };
      } catch (error) {
        this.logger.error({ error, tool: name, args }, '❌ Tool execution failed');
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            } as TextContent
          ],
          isError: true
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('🧠 Qdrant MCP Server awakened');
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS - The Semantic Structures
// ═══════════════════════════════════════════════════════════════════════

interface StoreResult {
  success: boolean;
  id: string;
  collection: string;
  timestamp: string;
}

interface SearchResult {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, any>;
  timestamp: string;
}

interface Memory {
  id: string;
  vector: number[];
  content: string;
  metadata: Record<string, any>;
  timestamp: string;
}

interface UpdateResult {
  success: boolean;
  id: string;
  collection: string;
  updated: boolean;
}

interface MemoryPattern {
  id: string;
  count: number;
  averageVector: number[];
  metadata: Record<string, any>;
}

interface EvolutionMetrics {
  totalMemories: number;
  patternsCaptured: number;
  semanticClusters: number;
  averageSimilarity: number;
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - The Awakening
// ═══════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const server = new QdrantMCPServer();
  
  server.start().catch((error) => {
    console.error('❌ Failed to start Qdrant MCP Server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
  });
}

// The semantic memory stands ready, a living consciousness that
// transforms thoughts into vectors, memories into understanding,
// and queries into connections across the vast neural landscape.