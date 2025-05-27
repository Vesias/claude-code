import { Server } from 'socket.io';
import { createServer } from 'http';
import { NextRequest } from 'next/server';
import { 
  createEvent, 
  EventType, 
  EventLevel, 
  AnyAGEvent 
} from '@/lib/realtime/event-types';

// Global Socket.IO server instance
let io: Server | null = null;

// Initialize Socket.IO server
function initSocketServer() {
  if (io) return io;

  const httpServer = createServer();
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    },
    path: '/api/socket'
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send welcome event
    const welcomeEvent = createEvent(
      EventType.SYSTEM,
      EventLevel.INFO,
      'socket-server',
      'Client connected',
      {
        description: `Socket ${socket.id} connected`,
        metadata: {
          socketId: socket.id,
          transport: socket.conn.transport.name,
          remoteAddress: socket.handshake.address
        }
      }
    );
    
    socket.emit('ag-event', welcomeEvent);
    
    // Handle client events
    socket.on('user-action', (data) => {
      const event = createEvent(
        EventType.USER,
        EventLevel.INFO,
        'client',
        data.action || 'User action',
        {
          metadata: data,
          user: socket.id
        }
      );
      
      // Broadcast to all clients
      io?.emit('ag-event', event);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const disconnectEvent = createEvent(
        EventType.SYSTEM,
        EventLevel.INFO,
        'socket-server',
        'Client disconnected',
        {
          description: `Socket ${socket.id} disconnected`,
          metadata: { socketId: socket.id }
        }
      );
      
      io?.emit('ag-event', disconnectEvent);
    });
  });

  // Start demo event generator
  startDemoEventGenerator();

  // Listen on port
  const port = process.env.SOCKET_PORT || 3001;
  httpServer.listen(port, () => {
    console.log(`Socket.IO server listening on port ${port}`);
  });

  return io;
}

// Demo event generator for testing
function startDemoEventGenerator() {
  if (!io) return;
  
  const eventGenerators = [
    // System events
    () => createEvent(
      EventType.SYSTEM,
      EventLevel.INFO,
      'system-monitor',
      'System health check',
      {
        description: 'Routine system health check completed',
        metadata: {
          cpu: Math.round(Math.random() * 100),
          memory: Math.round(Math.random() * 100),
          disk: Math.round(Math.random() * 100)
        },
        duration: Math.round(Math.random() * 100)
      }
    ),
    
    // App events
    () => createEvent(
      EventType.APP,
      EventLevel.INFO,
      'app-manager',
      'Application launched',
      {
        description: `${['Terminal', 'File Manager', 'Settings', 'Browser'][Math.floor(Math.random() * 4)]} opened`,
        metadata: {
          appId: crypto.randomUUID(),
          windowId: crypto.randomUUID()
        }
      }
    ),
    
    // File events
    () => createEvent(
      EventType.FILE,
      EventLevel.INFO,
      'file-watcher',
      'File modified',
      {
        description: `File ${['config.json', 'data.csv', 'report.pdf'][Math.floor(Math.random() * 3)]} was modified`,
        metadata: {
          path: `/home/user/documents/${Math.random().toString(36).substring(7)}`,
          size: Math.round(Math.random() * 1000000)
        }
      }
    ),
    
    // Network events
    () => createEvent(
      EventType.NETWORK,
      EventLevel.INFO,
      'network-monitor',
      'API request',
      {
        description: `${['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)]} request completed`,
        metadata: {
          url: `https://api.example.com/v1/${['users', 'posts', 'data'][Math.floor(Math.random() * 3)]}`,
          status: [200, 201, 204, 404, 500][Math.floor(Math.random() * 5)],
          latency: Math.round(Math.random() * 500)
        },
        duration: Math.round(Math.random() * 1000)
      }
    ),
    
    // Performance events
    () => createEvent(
      EventType.PERFORMANCE,
      Math.random() > 0.8 ? EventLevel.WARNING : EventLevel.INFO,
      'performance-monitor',
      'Performance metric',
      {
        description: 'Memory usage threshold',
        metadata: {
          metric: 'memory_usage',
          value: Math.round(Math.random() * 100),
          unit: 'percent',
          threshold: { warning: 80, critical: 95 }
        }
      }
    ),
    
    // Security events
    () => createEvent(
      EventType.SECURITY,
      Math.random() > 0.9 ? EventLevel.WARNING : EventLevel.INFO,
      'security-scanner',
      'Security scan',
      {
        description: 'Routine security scan completed',
        metadata: {
          threatsFound: Math.floor(Math.random() * 3),
          filesScanned: Math.round(Math.random() * 1000)
        },
        tags: ['automated', 'scheduled']
      }
    )
  ];
  
  // Generate events at random intervals
  setInterval(() => {
    if (io && io.engine.clientsCount > 0) {
      const generator = eventGenerators[Math.floor(Math.random() * eventGenerators.length)];
      const event = generator();
      io.emit('ag-event', event);
    }
  }, Math.random() * 3000 + 1000); // Between 1-4 seconds
}

// API route handler
export async function GET(request: NextRequest) {
  // Initialize server if not already running
  if (!io) {
    initSocketServer();
  }
  
  return new Response(
    JSON.stringify({ 
      status: 'Socket.IO server running',
      port: process.env.SOCKET_PORT || 3001,
      clients: io?.engine.clientsCount || 0
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!io) {
      initSocketServer();
    }
    
    // Emit custom event
    const event = createEvent(
      data.type || EventType.SYSTEM,
      data.level || EventLevel.INFO,
      data.source || 'api',
      data.title || 'API Event',
      {
        description: data.description,
        metadata: data.metadata,
        tags: data.tags
      }
    );
    
    io?.emit('ag-event', event);
    
    return new Response(
      JSON.stringify({ success: true, event }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to emit event' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}