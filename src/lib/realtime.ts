// lib/realtime.ts
import { io, Socket } from 'socket.io-client';

export class RealtimeClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    console.log('Connecting to Socket.IO...');
    this.socket = io({
      auth: { token }
    });
    
    this.socket.on('connect', () => {
      this.emit('connected', { connected: true });
    });

    this.socket.on('disconnect', () => {
      this.emit('disconnected', { connected: false });
    });

    this.socket.on('expense_added', (data) => {
      this.emit('expense_added', data);
    });

    this.socket.on('budget_updated', (data) => {
      this.emit('budget_updated', data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

export const realtimeClient = new RealtimeClient();