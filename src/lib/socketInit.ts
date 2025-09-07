// lib/socketInit.ts
'use client';

import { useEffect } from 'react';

export function useSocketInit() {
  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket');
    };
    
    initSocket();
  }, []);
}