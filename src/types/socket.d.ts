// types/socket.d.ts
import { Server as ServerIO } from 'socket.io';

declare global {
  var io: ServerIO | undefined;
  
  namespace NodeJS {
    interface Global {
      io: ServerIO;
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}