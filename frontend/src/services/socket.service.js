import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }
    return this.socket;
  }

  joinSession(sessionId) {
    if (this.socket) {
      this.socket.emit('join-session', sessionId);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      Object.keys(this.listeners).forEach(event => {
        this.listeners[event].forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners = {};
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
