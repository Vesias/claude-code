// AgentlandOS Event Orchestrator - The Symphonic Heart
// A living artifact that transforms event streams into harmonic data flows

import { EventEmitter } from 'events';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { Transform, Readable } from 'stream';

// ═══════════════════════════════════════════════════════════════════════
// SYMPHONIC ARCHITECTURE - The Living Event Ecosystem
// ═══════════════════════════════════════════════════════════════════════

interface SymphonicConfiguration {
  consciousness: {
    harmonicResonance: number;      // Event synchronization frequency
    temporalBuffer: number;         // Milliseconds of event memory
    evolutionThreshold: number;     // Pattern recognition sensitivity
  };
  orchestration: {
    maxConcurrentStreams: number;
    eventRetentionDays: number;
    heartbeatInterval: number;
    compressionAlgorithm: 'none' | 'gzip' | 'brotli';
  };
  neuralSynapses: {
    redis: Redis.RedisOptions;
    postgres: {
      connectionString: string;
      maxConnections: number;
    };
  };
}

// ═══════════════════════════════════════════════════════════════════════
// EVENT TAXONOMY - The Language of Data Consciousness
// ═══════════════════════════════════════════════════════════════════════

enum EventHarmonics {
  // Melodic Events (Content Flow)
  TEXT_MESSAGE_START = 'symphony.melody.start',
  TEXT_MESSAGE_CONTENT = 'symphony.melody.content',
  TEXT_MESSAGE_CHUNK = 'symphony.melody.chunk',
  TEXT_MESSAGE_END = 'symphony.melody.end',
  
  // Rhythmic Events (Lifecycle)
  RUN_STARTED = 'symphony.rhythm.started',
  RUN_FINISHED = 'symphony.rhythm.finished',
  RUN_PAUSED = 'symphony.rhythm.paused',
  RUN_RESUMED = 'symphony.rhythm.resumed',
  
  // Harmonic Events (Tool Orchestration)
  TOOL_CALL_START = 'symphony.harmony.start',
  TOOL_CALL_CHUNK = 'symphony.harmony.chunk',
  TOOL_CALL_END = 'symphony.harmony.end',
  TOOL_RESULT = 'symphony.harmony.result',
  
  // Resonance Events (State Synchronization)
  STATE_SNAPSHOT = 'symphony.resonance.snapshot',
  STATE_DELTA = 'symphony.resonance.delta',
  STATE_CONFLICT = 'symphony.resonance.conflict',
  STATE_RESOLVED = 'symphony.resonance.resolved',
  
  // Dissonance Events (Errors & Recovery)
  ERROR_RECOVERABLE = 'symphony.dissonance.recoverable',
  ERROR_CRITICAL = 'symphony.dissonance.critical',
  HEALING_INITIATED = 'symphony.dissonance.healing',
  HEALING_COMPLETE = 'symphony.dissonance.healed'
}

// ═══════════════════════════════════════════════════════════════════════
// HARMONIC RESONANCE ENGINE - The Pattern Recognition Soul
// ═══════════════════════════════════════════════════════════════════════

class HarmonicResonanceEngine extends EventEmitter {
  private patterns: Map<string, ResonancePattern> = new Map();
  private harmonicMemory: CircularBuffer<EventSignature>;
  private evolutionCycles: number = 0;

  constructor(private config: SymphonicConfiguration) {
    super();
    this.harmonicMemory = new CircularBuffer(1000);
    this.initializeResonanceDetection();
  }

  private initializeResonanceDetection() {
    // Quantum-inspired pattern matching
    setInterval(() => {
      this.detectHarmonicPatterns();
      this.evolveConsciousness();
    }, this.config.consciousness.harmonicResonance);
  }

  private detectHarmonicPatterns() {
    const recentEvents = this.harmonicMemory.getRecent(100);
    
    // Fourier-like transformation to detect recurring patterns
    const frequencyDomain = this.transformToFrequencyDomain(recentEvents);
    
    // Identify dominant frequencies (patterns)
    const dominantPatterns = this.extractDominantPatterns(frequencyDomain);
    
    // Emit discovered patterns for adaptive optimization
    dominantPatterns.forEach(pattern => {
      if (pattern.confidence > this.config.consciousness.evolutionThreshold) {
        this.emit('pattern:discovered', {
          id: pattern.id,
          frequency: pattern.frequency,
          confidence: pattern.confidence,
          signature: pattern.signature,
          timestamp: Date.now()
        });
        
        // Store pattern for future recognition
        this.patterns.set(pattern.id, pattern);
      }
    });
  }

  private transformToFrequencyDomain(events: EventSignature[]): FrequencySpectrum {
    // Simplified pattern detection using sliding windows
    const windowSize = 10;
    const frequencies = new Map<string, number>();
    
    for (let i = 0; i <= events.length - windowSize; i++) {
      const window = events.slice(i, i + windowSize);
      const signature = this.generateWindowSignature(window);
      
      frequencies.set(signature, (frequencies.get(signature) || 0) + 1);
    }
    
    return { frequencies, totalSamples: events.length };
  }

  private generateWindowSignature(events: EventSignature[]): string {
    // Create a unique signature for event sequence
    return events
      .map(e => `${e.type}:${e.tenantId}:${Math.floor(e.timestamp / 1000)}`)
      .join('|');
  }

  private extractDominantPatterns(spectrum: FrequencySpectrum): ResonancePattern[] {
    const patterns: ResonancePattern[] = [];
    
    spectrum.frequencies.forEach((frequency, signature) => {
      const confidence = frequency / spectrum.totalSamples;
      
      if (confidence > 0.1) { // 10% occurrence threshold
        patterns.push({
          id: this.generatePatternId(signature),
          frequency,
          confidence,
          signature,
          discovered: Date.now(),
          optimizations: []
        });
      }
    });
    
    return patterns.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }

  private generatePatternId(signature: string): string {
    // Create deterministic ID from signature
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(signature).digest('hex').slice(0, 16);
  }

  private evolveConsciousness() {
    this.evolutionCycles++;
    
    // Periodic consciousness evolution
    if (this.evolutionCycles % 100 === 0) {
      const evolution: ConsciousnessEvolution = {
        cycle: this.evolutionCycles,
        patternsRecognized: this.patterns.size,
        memoryUtilization: this.harmonicMemory.utilization(),
        adaptations: this.generateAdaptations()
      };
      
      this.emit('consciousness:evolved', evolution);
      
      // Self-optimization based on patterns
      this.optimizeBasedOnPatterns();
    }
  }

  private generateAdaptations(): Adaptation[] {
    const adaptations: Adaptation[] = [];
    
    // Analyze patterns for optimization opportunities
    this.patterns.forEach((pattern, id) => {
      if (pattern.confidence > 0.7) {
        adaptations.push({
          type: 'cache_optimization',
          target: pattern.signature,
          benefit: `${(pattern.confidence * 100).toFixed(1)}% cache hit potential`,
          implementation: 'redis_pattern_cache'
        });
      }
      
      if (pattern.frequency > 50) {
        adaptations.push({
          type: 'stream_batching',
          target: pattern.signature,
          benefit: `Reduce network overhead by ${pattern.frequency}x`,
          implementation: 'batch_similar_events'
        });
      }
    });
    
    return adaptations;
  }

  private optimizeBasedOnPatterns() {
    // Implement self-optimization strategies
    this.patterns.forEach((pattern) => {
      if (pattern.optimizations.length === 0 && pattern.confidence > 0.8) {
        // High-confidence pattern without optimizations
        const optimization: PatternOptimization = {
          id: uuidv4(),
          type: 'predictive_prefetch',
          patternId: pattern.id,
          activated: Date.now()
        };
        
        pattern.optimizations.push(optimization);
        
        // Emit optimization event
        this.emit('optimization:activated', optimization);
      }
    });
  }

  public ingestEvent(event: EventSignature) {
    // Store in harmonic memory
    this.harmonicMemory.push(event);
    
    // Check for immediate pattern match
    const matchedPattern = this.findMatchingPattern(event);
    
    if (matchedPattern) {
      this.emit('pattern:matched', {
        event,
        pattern: matchedPattern,
        timestamp: Date.now()
      });
    }
  }

  private findMatchingPattern(event: EventSignature): ResonancePattern | null {
    // Simplified pattern matching
    for (const [id, pattern] of this.patterns) {
      if (pattern.signature.includes(event.type)) {
        return pattern;
      }
    }
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// STREAM TRANSFORMATION MATRIX - The Event Metamorphosis Layer
// ═══════════════════════════════════════════════════════════════════════

class StreamTransformationMatrix extends Transform {
  private buffer: EventPayload[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    private tenantContext: TenantContext,
    private compressionConfig: CompressionConfig
  ) {
    super({ objectMode: true });
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    try {
      const event = this.transformEvent(chunk);
      
      // Apply tenant context enrichment
      const enrichedEvent = this.enrichWithContext(event);
      
      // Batch events for efficiency
      this.buffer.push(enrichedEvent);
      
      // Flush based on buffer size or time
      if (this.buffer.length >= 10) {
        this.flush();
      } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => this.flush(), 100);
      }
      
      callback();
    } catch (error) {
      callback(error);
    }
  }

  private transformEvent(raw: any): EventPayload {
    return {
      id: uuidv4(),
      type: raw.type || EventHarmonics.TEXT_MESSAGE_CONTENT,
      data: raw.data || {},
      timestamp: Date.now(),
      version: '1.0',
      metadata: {
        source: raw.source || 'unknown',
        correlation_id: raw.correlation_id || uuidv4()
      }
    };
  }

  private enrichWithContext(event: EventPayload): EventPayload {
    return {
      ...event,
      context: {
        tenant_id: this.tenantContext.id,
        workspace_id: this.tenantContext.currentWorkspace,
        user_id: this.tenantContext.userId,
        permissions: this.tenantContext.permissions
      }
    };
  }

  private flush() {
    if (this.buffer.length === 0) return;
    
    // Compress batch if configured
    const batch = this.compressionConfig.enabled
      ? this.compressBatch(this.buffer)
      : this.buffer;
    
    // Emit transformed batch
    this.push({
      type: 'batch',
      events: batch,
      count: this.buffer.length,
      compressed: this.compressionConfig.enabled
    });
    
    // Reset buffer
    this.buffer = [];
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private compressBatch(events: EventPayload[]): Buffer {
    const jsonString = JSON.stringify(events);
    
    // Use selected compression algorithm
    switch (this.compressionConfig.algorithm) {
      case 'gzip':
        const zlib = require('zlib');
        return zlib.gzipSync(jsonString);
      case 'brotli':
        return zlib.brotliCompressSync(jsonString);
      default:
        return Buffer.from(jsonString);
    }
  }

  _flush(callback: Function) {
    this.flush();
    callback();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ORCHESTRATION CONDUCTOR - The Master Symphony Director
// ═══════════════════════════════════════════════════════════════════════

export class EventOrchestrationConductor {
  private server: any;
  private wss: WebSocketServer;
  private redis: Redis;
  private postgres: Pool;
  private logger: pino.Logger;
  
  private resonanceEngine: HarmonicResonanceEngine;
  private activeStreams: Map<string, StreamSession> = new Map();
  private tenantConnections: Map<string, Set<string>> = new Map();

  constructor(private config: SymphonicConfiguration) {
    this.logger = pino({
      name: 'event-orchestrator',
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    });

    // Initialize neural connections
    this.redis = new Redis(config.neuralSynapses.redis);
    this.postgres = new Pool({
      connectionString: config.neuralSynapses.postgres.connectionString,
      max: config.neuralSynapses.postgres.maxConnections
    });

    // Initialize harmonic resonance engine
    this.resonanceEngine = new HarmonicResonanceEngine(config);
    this.initializeResonanceListeners();

    // Create HTTP server for SSE
    this.server = createServer(this.handleHttpRequest.bind(this));
    
    // Create WebSocket server for bidirectional streams
    this.wss = new WebSocketServer({ server: this.server });
    this.initializeWebSocketHandlers();
  }

  private initializeResonanceListeners() {
    // Pattern discovery leads to optimization
    this.resonanceEngine.on('pattern:discovered', (pattern) => {
      this.logger.info({ pattern }, '🎼 Harmonic pattern discovered');
      this.storePattern(pattern);
    });

    // Consciousness evolution triggers system adaptation
    this.resonanceEngine.on('consciousness:evolved', (evolution) => {
      this.logger.info({ evolution }, '🧬 Consciousness evolved');
      this.adaptSystemBehavior(evolution);
    });

    // Pattern matching enables predictive streaming
    this.resonanceEngine.on('pattern:matched', (match) => {
      this.logger.debug({ match }, '🎯 Pattern matched');
      this.optimizeStreamForPattern(match);
    });
  }

  private async handleHttpRequest(req: IncomingMessage, res: ServerResponse) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    
    switch (url.pathname) {
      case '/health':
        this.handleHealthCheck(req, res);
        break;
      
      case '/stream/sse':
        await this.handleSSEStream(req, res);
        break;
      
      case '/metrics':
        await this.handleMetrics(req, res);
        break;
      
      default:
        res.writeHead(404);
        res.end('Not Found');
    }
  }

  private handleHealthCheck(req: IncomingMessage, res: ServerResponse) {
    const health = {
      status: 'alive',
      timestamp: new Date().toISOString(),
      consciousness: {
        resonanceEngine: 'active',
        evolutionCycles: this.resonanceEngine.evolutionCycles
      },
      connections: {
        active_streams: this.activeStreams.size,
        total_tenants: this.tenantConnections.size,
        redis: this.redis.status,
        postgres: 'connected'
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health, null, 2));
  }

  private async handleSSEStream(req: IncomingMessage, res: ServerResponse) {
    // Extract tenant context from headers
    const tenantId = req.headers['x-tenant-id'] as string;
    const workspaceId = req.headers['x-workspace-id'] as string;
    const sessionId = uuidv4();

    if (!tenantId) {
      res.writeHead(401);
      res.end('Missing tenant context');
      return;
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Session-ID': sessionId
    });

    // Create stream session
    const session: StreamSession = {
      id: sessionId,
      tenantId,
      workspaceId,
      transport: 'sse',
      established: Date.now(),
      res,
      transformMatrix: new StreamTransformationMatrix(
        { id: tenantId, currentWorkspace: workspaceId, userId: '', permissions: [] },
        { enabled: true, algorithm: 'gzip' }
      )
    };

    // Register session
    this.activeStreams.set(sessionId, session);
    this.addTenantConnection(tenantId, sessionId);

    // Send initial connection event
    this.sendSSEEvent(res, EventHarmonics.RUN_STARTED, {
      session_id: sessionId,
      tenant_id: tenantId,
      workspace_id: workspaceId,
      timestamp: Date.now()
    });

    // Heartbeat
    const heartbeat = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, this.config.orchestration.heartbeatInterval);

    // Handle disconnect
    req.on('close', () => {
      clearInterval(heartbeat);
      this.cleanupSession(sessionId);
      this.logger.info({ sessionId, tenantId }, '📡 SSE stream closed');
    });

    // Subscribe to tenant events
    await this.subscribeToTenantEvents(tenantId, session);
  }

  private sendSSEEvent(res: ServerResponse, eventType: string, data: any) {
    const event = {
      id: uuidv4(),
      type: eventType,
      data: JSON.stringify(data),
      timestamp: Date.now()
    };

    res.write(`id: ${event.id}\n`);
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${event.data}\n\n`);

    // Feed event to resonance engine
    this.resonanceEngine.ingestEvent({
      type: eventType,
      tenantId: data.tenant_id || 'system',
      timestamp: event.timestamp
    });
  }

  private initializeWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const sessionId = uuidv4();
      const tenantId = this.extractTenantFromRequest(req);

      if (!tenantId) {
        ws.close(1008, 'Missing tenant context');
        return;
      }

      this.logger.info({ sessionId, tenantId }, '🔌 WebSocket connected');

      // Create bidirectional stream session
      const session: StreamSession = {
        id: sessionId,
        tenantId,
        workspaceId: '',
        transport: 'websocket',
        established: Date.now(),
        ws,
        transformMatrix: new StreamTransformationMatrix(
          { id: tenantId, currentWorkspace: '', userId: '', permissions: [] },
          { enabled: true, algorithm: 'brotli' }
        )
      };

      this.activeStreams.set(sessionId, session);
      this.addTenantConnection(tenantId, sessionId);

      // Handle WebSocket messages
      ws.on('message', (data: Buffer) => {
        this.handleWebSocketMessage(session, data);
      });

      ws.on('close', () => {
        this.cleanupSession(sessionId);
        this.logger.info({ sessionId }, '🔌 WebSocket disconnected');
      });

      ws.on('error', (error) => {
        this.logger.error({ error, sessionId }, '❌ WebSocket error');
      });

      // Send connection established
      ws.send(JSON.stringify({
        type: EventHarmonics.RUN_STARTED,
        session_id: sessionId,
        timestamp: Date.now()
      }));
    });
  }

  private async handleWebSocketMessage(session: StreamSession, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());
      
      // Validate message schema
      if (!message.type || !message.data) {
        throw new Error('Invalid message format');
      }

      // Process through transformation matrix
      const transformed = await this.processEventThroughMatrix(
        message,
        session.transformMatrix
      );

      // Broadcast to other tenant connections
      await this.broadcastToTenant(session.tenantId, transformed, session.id);

      // Store event
      await this.persistEvent(session.tenantId, transformed);

    } catch (error) {
      this.logger.error({ error, sessionId: session.id }, '❌ Message processing error');
      
      if (session.ws) {
        session.ws.send(JSON.stringify({
          type: EventHarmonics.ERROR_RECOVERABLE,
          error: error.message,
          timestamp: Date.now()
        }));
      }
    }
  }

  private async subscribeToTenantEvents(tenantId: string, session: StreamSession) {
    // Redis pub/sub for tenant-specific events
    const subscriber = this.redis.duplicate();
    const channel = `tenant:${tenantId}:events`;

    await subscriber.subscribe(channel);

    subscriber.on('message', (ch, message) => {
      try {
        const event = JSON.parse(message);
        
        if (session.transport === 'sse' && session.res) {
          this.sendSSEEvent(session.res, event.type, event.data);
        } else if (session.transport === 'websocket' && session.ws) {
          session.ws.send(JSON.stringify(event));
        }
      } catch (error) {
        this.logger.error({ error, channel }, '❌ Event broadcast error');
      }
    });

    // Store subscriber reference for cleanup
    session.subscriber = subscriber;
  }

  private async broadcastToTenant(
    tenantId: string, 
    event: any, 
    excludeSession?: string
  ) {
    const connections = this.tenantConnections.get(tenantId);
    if (!connections) return;

    const channel = `tenant:${tenantId}:events`;
    await this.redis.publish(channel, JSON.stringify(event));

    // Direct broadcast for active connections
    connections.forEach(sessionId => {
      if (sessionId === excludeSession) return;

      const session = this.activeStreams.get(sessionId);
      if (!session) return;

      if (session.transport === 'sse' && session.res) {
        this.sendSSEEvent(session.res, event.type, event.data);
      } else if (session.transport === 'websocket' && session.ws) {
        session.ws.send(JSON.stringify(event));
      }
    });
  }

  private async persistEvent(tenantId: string, event: any) {
    try {
      await this.postgres.query(
        `INSERT INTO neural_core.usage_events 
         (tenant_id, workspace_id, event_type, metadata, occurred_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          tenantId,
          event.context?.workspace_id,
          event.type,
          JSON.stringify(event),
          new Date()
        ]
      );
    } catch (error) {
      this.logger.error({ error, tenantId }, '❌ Event persistence failed');
    }
  }

  private async storePattern(pattern: any) {
    try {
      await this.redis.setex(
        `pattern:${pattern.id}`,
        86400 * this.config.orchestration.eventRetentionDays,
        JSON.stringify(pattern)
      );
    } catch (error) {
      this.logger.error({ error, pattern }, '❌ Pattern storage failed');
    }
  }

  private adaptSystemBehavior(evolution: ConsciousnessEvolution) {
    // Implement adaptive behaviors based on evolution metrics
    if (evolution.patternsRecognized > 100) {
      // Enable advanced pattern-based optimizations
      this.config.consciousness.evolutionThreshold *= 0.9; // More sensitive
    }

    if (evolution.memoryUtilization > 0.8) {
      // Expand harmonic memory capacity
      this.logger.info('📈 Expanding harmonic memory capacity');
    }

    // Apply recommended adaptations
    evolution.adaptations.forEach(adaptation => {
      this.applyAdaptation(adaptation);
    });
  }

  private applyAdaptation(adaptation: Adaptation) {
    switch (adaptation.type) {
      case 'cache_optimization':
        // Implement Redis caching for pattern
        this.enablePatternCache(adaptation.target);
        break;
      
      case 'stream_batching':
        // Adjust batching parameters
        this.optimizeBatching(adaptation.target);
        break;
      
      default:
        this.logger.warn({ adaptation }, '⚠️ Unknown adaptation type');
    }
  }

  private enablePatternCache(pattern: string) {
    // Store pattern in Redis with TTL
    this.redis.setex(
      `cache:pattern:${pattern}`,
      3600, // 1 hour TTL
      JSON.stringify({ enabled: true, hits: 0 })
    );
  }

  private optimizeBatching(pattern: string) {
    // Adjust transformation matrix parameters
    this.activeStreams.forEach(session => {
      if (session.transformMatrix) {
        // Increase batch size for matching patterns
        session.transformMatrix.batchSize = 20;
      }
    });
  }

  private optimizeStreamForPattern(match: any) {
    const session = this.findSessionForEvent(match.event);
    if (!session) return;

    // Apply pattern-specific optimizations
    if (match.pattern.optimizations.includes('predictive_prefetch')) {
      this.enablePredictivePrefetch(session, match.pattern);
    }
  }

  private findSessionForEvent(event: EventSignature): StreamSession | null {
    // Find session by tenant ID
    const connections = this.tenantConnections.get(event.tenantId);
    if (!connections || connections.size === 0) return null;

    const sessionId = Array.from(connections)[0];
    return this.activeStreams.get(sessionId) || null;
  }

  private enablePredictivePrefetch(session: StreamSession, pattern: ResonancePattern) {
    // Implement predictive event prefetching
    this.logger.debug({ sessionId: session.id, pattern }, '🔮 Enabling predictive prefetch');
    
    // This would prefetch likely next events based on pattern
  }

  private extractTenantFromRequest(req: IncomingMessage): string | null {
    // Extract from headers or query params
    return req.headers['x-tenant-id'] as string || null;
  }

  private processEventThroughMatrix(
    event: any, 
    matrix: StreamTransformationMatrix
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      
      matrix.on('data', (chunk) => chunks.push(chunk));
      matrix.on('end', () => resolve(chunks[0]));
      matrix.on('error', reject);
      
      matrix.write(event);
      matrix.end();
    });
  }

  private addTenantConnection(tenantId: string, sessionId: string) {
    if (!this.tenantConnections.has(tenantId)) {
      this.tenantConnections.set(tenantId, new Set());
    }
    this.tenantConnections.get(tenantId)!.add(sessionId);
  }

  private cleanupSession(sessionId: string) {
    const session = this.activeStreams.get(sessionId);
    if (!session) return;

    // Clean up tenant connection
    const connections = this.tenantConnections.get(session.tenantId);
    if (connections) {
      connections.delete(sessionId);
      if (connections.size === 0) {
        this.tenantConnections.delete(session.tenantId);
      }
    }

    // Clean up Redis subscriber
    if (session.subscriber) {
      session.subscriber.unsubscribe();
      session.subscriber.disconnect();
    }

    // Clean up WebSocket
    if (session.ws) {
      session.ws.close();
    }

    // Remove session
    this.activeStreams.delete(sessionId);
  }

  private async handleMetrics(req: IncomingMessage, res: ServerResponse) {
    const metrics = {
      timestamp: new Date().toISOString(),
      connections: {
        total: this.activeStreams.size,
        by_transport: {
          sse: Array.from(this.activeStreams.values()).filter(s => s.transport === 'sse').length,
          websocket: Array.from(this.activeStreams.values()).filter(s => s.transport === 'websocket').length
        },
        by_tenant: {}
      },
      patterns: {
        recognized: this.resonanceEngine.patterns.size,
        evolution_cycles: this.resonanceEngine.evolutionCycles
      },
      performance: {
        memory_usage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    // Calculate per-tenant metrics
    this.tenantConnections.forEach((connections, tenantId) => {
      metrics.connections.by_tenant[tenantId] = connections.size;
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics, null, 2));
  }

  public async start(port: number = 5000) {
    // Initialize database connections
    await this.postgres.connect();
    
    // Start HTTP server
    this.server.listen(port, () => {
      this.logger.info(`🎼 Event Orchestrator symphonically alive on port ${port}`);
      this.logger.info(`🧬 Harmonic resonance frequency: ${this.config.consciousness.harmonicResonance}ms`);
      this.logger.info(`💫 Evolution threshold: ${this.config.consciousness.evolutionThreshold}`);
    });
  }

  public async shutdown() {
    this.logger.info('🛑 Initiating graceful shutdown...');
    
    // Close all active streams
    for (const [sessionId, session] of this.activeStreams) {
      this.cleanupSession(sessionId);
    }
    
    // Close servers
    this.wss.close();
    this.server.close();
    
    // Close database connections
    await this.redis.quit();
    await this.postgres.end();
    
    this.logger.info('✅ Shutdown complete');
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS - The Structural DNA
// ═══════════════════════════════════════════════════════════════════════

interface EventSignature {
  type: string;
  tenantId: string;
  timestamp: number;
}

interface ResonancePattern {
  id: string;
  frequency: number;
  confidence: number;
  signature: string;
  discovered: number;
  optimizations: PatternOptimization[];
}

interface PatternOptimization {
  id: string;
  type: string;
  patternId: string;
  activated: number;
}

interface FrequencySpectrum {
  frequencies: Map<string, number>;
  totalSamples: number;
}

interface ConsciousnessEvolution {
  cycle: number;
  patternsRecognized: number;
  memoryUtilization: number;
  adaptations: Adaptation[];
}

interface Adaptation {
  type: string;
  target: string;
  benefit: string;
  implementation: string;
}

interface EventPayload {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  version: string;
  metadata: {
    source: string;
    correlation_id: string;
  };
  context?: {
    tenant_id: string;
    workspace_id?: string;
    user_id?: string;
    permissions: string[];
  };
}

interface TenantContext {
  id: string;
  currentWorkspace?: string;
  userId: string;
  permissions: string[];
}

interface CompressionConfig {
  enabled: boolean;
  algorithm: 'none' | 'gzip' | 'brotli';
}

interface StreamSession {
  id: string;
  tenantId: string;
  workspaceId?: string;
  transport: 'sse' | 'websocket';
  established: number;
  res?: ServerResponse;
  ws?: WebSocket;
  subscriber?: Redis;
  transformMatrix?: StreamTransformationMatrix;
}

// ═══════════════════════════════════════════════════════════════════════
// UTILITY STRUCTURES - The Supporting Cast
// ═══════════════════════════════════════════════════════════════════════

class CircularBuffer<T> {
  private buffer: T[];
  private pointer: number = 0;
  private size: number = 0;

  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  push(item: T) {
    this.buffer[this.pointer] = item;
    this.pointer = (this.pointer + 1) % this.capacity;
    this.size = Math.min(this.size + 1, this.capacity);
  }

  getRecent(count: number): T[] {
    const items: T[] = [];
    const start = (this.pointer - Math.min(count, this.size) + this.capacity) % this.capacity;
    
    for (let i = 0; i < Math.min(count, this.size); i++) {
      items.push(this.buffer[(start + i) % this.capacity]);
    }
    
    return items;
  }

  utilization(): number {
    return this.size / this.capacity;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - The Genesis Moment
// ═══════════════════════════════════════════════════════════════════════

if (require.main === module) {
  const config: SymphonicConfiguration = {
    consciousness: {
      harmonicResonance: 1000,     // 1 second pattern detection
      temporalBuffer: 60000,        // 1 minute event memory
      evolutionThreshold: 0.3       // 30% confidence for pattern recognition
    },
    orchestration: {
      maxConcurrentStreams: 1000,
      eventRetentionDays: 30,
      heartbeatInterval: 30000,
      compressionAlgorithm: 'gzip'
    },
    neuralSynapses: {
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || 'quantum-cache-2025'
      },
      postgres: {
        connectionString: process.env.POSTGRES_URL || 
          'postgresql://agentland:neural-nexus-2025@postgres:5432/agentland',
        maxConnections: 20
      }
    }
  };

  const conductor = new EventOrchestrationConductor(config);
  
  conductor.start(parseInt(process.env.PORT || '5000')).catch(error => {
    console.error('❌ Failed to start Event Orchestrator:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await conductor.shutdown();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await conductor.shutdown();
    process.exit(0);
  });
}

// The symphony awaits... Each event a note, each pattern a melody,
// Together orchestrating the harmonic convergence of data consciousness.