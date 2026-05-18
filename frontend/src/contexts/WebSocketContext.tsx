import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { WSMessage, WSMessageType } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

type MessageHandler = (payload: any) => void;

interface PendingMessage {
  type: WSMessageType;
  payload?: any;
}

interface WebSocketContextType {
  connected: boolean;
  send: (type: WSMessageType, payload?: any) => void;
  on: (type: WSMessageType, handler: MessageHandler) => void;
  off: (type: WSMessageType, handler: MessageHandler) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
  const pendingRef = useRef<PendingMessage[]>([]);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const flushPending = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    while (pendingRef.current.length > 0) {
      const msg = pendingRef.current.shift()!;
      const message: WSMessage = { type: msg.type, payload: msg.payload };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (!mountedRef.current) return;
    reconnectTimerRef.current = setTimeout(() => {
      if (mountedRef.current) connect();
    }, 2000);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      if (wsRef.current !== ws) return;
      setConnected(true);
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      flushPending();
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      setConnected(false);
      wsRef.current = null;
      scheduleReconnect();
    };

    ws.onerror = () => {
      if (wsRef.current !== ws) return;
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        const typeHandlers = handlersRef.current.get(message.type);
        if (typeHandlers) {
          typeHandlers.forEach((handler) => handler(message.payload));
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    wsRef.current = ws;
  }, [flushPending, scheduleReconnect]);

  const send = useCallback((type: WSMessageType, payload?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WSMessage = { type, payload };
      wsRef.current.send(JSON.stringify(message));
    } else {
      pendingRef.current.push({ type, payload });
    }
  }, []);

  const on = useCallback((type: WSMessageType, handler: MessageHandler) => {
    if (!handlersRef.current.has(type)) {
      handlersRef.current.set(type, new Set());
    }
    handlersRef.current.get(type)!.add(handler);
  }, []);

  const off = useCallback((type: WSMessageType, handler: MessageHandler) => {
    const typeHandlers = handlersRef.current.get(type);
    if (typeHandlers) {
      typeHandlers.delete(handler);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return (
    <WebSocketContext.Provider value={{ connected, send, on, off }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
