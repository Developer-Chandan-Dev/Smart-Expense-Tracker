// components/RealtimeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { realtimeClient } from '@/lib/realtime';

interface RealtimeContextType {
  isConnected: boolean;
  lastUpdate: any;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  lastUpdate: null
});

export function RealtimeProvider({ children, token }: { children: ReactNode; token?: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!token) return;

    realtimeClient.connect(token);

    realtimeClient.on('connected', () => {
      setIsConnected(true);
    });

    realtimeClient.on('disconnected', () => {
      setIsConnected(false);
    });

    realtimeClient.on('expense_added', (data) => {
      setLastUpdate({ type: 'expense_added', data, timestamp: Date.now() });
    });

    realtimeClient.on('budget_updated', (data) => {
      setLastUpdate({ type: 'budget_updated', data, timestamp: Date.now() });
    });

    return () => {
      realtimeClient.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return (
    <RealtimeContext.Provider value={{ isConnected, lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);