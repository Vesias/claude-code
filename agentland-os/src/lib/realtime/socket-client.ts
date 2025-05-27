import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

export interface SocketConfig {
  url?: string;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

class SocketClient extends EventEmitter {
  private socket: Socket | null = null;
  private config: SocketConfig;

  constructor(config: SocketConfig = {}) {
    super();
    this.config = {
      url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...config
    };
  }

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.config.url!, {
      reconnection: this.config.reconnection,
      reconnectionAttempts: this.config.reconnectionAttempts,
      reconnectionDelay: this.config.reconnectionDelay,
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emit('disconnected', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Forward all AG-UI events
    this.socket.on('ag-event', (data) => {
      this.emit('ag-event', data);
    });

    this.socket.on('system-event', (data) => {
      this.emit('system-event', data);
    });

    this.socket.on('user-event', (data) => {
      this.emit('user-event', data);
    });

    this.socket.on('app-event', (data) => {
      this.emit('app-event', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, handler: (...args: any[]) => void): this {
    super.on(event, handler);
    return this;
  }

  off(event: string, handler: (...args: any[]) => void): this {
    super.off(event, handler);
    return this;
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketClient = new SocketClient();

// Export class for custom instances
export { SocketClient };