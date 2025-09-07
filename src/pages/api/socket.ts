// pages/api/socket.ts
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO, initSocket } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = initSocket(res.socket.server);
  res.end();
}