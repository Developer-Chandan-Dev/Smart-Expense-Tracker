// components/RealtimeStatus.tsx
'use client';

import { Wifi, WifiOff } from 'lucide-react';
import { useRealtime } from './RealtimeProvider';

export default function RealtimeStatus() {
  const { isConnected } = useRealtime();

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
      isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isConnected ? (
        <Wifi className="w-3 h-3" />
      ) : (
        <WifiOff className="w-3 h-3" />
      )}
      <span className="hidden sm:inline">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}