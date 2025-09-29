import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { CONFIG } from './config';

type ClientInfo = { ws: WebSocket; userId: number | null; subs: Set<string>; };
export type WebSocketHub = { notifyUser: (userId: number, msg: any) => void; broadcastPrice: (symbol: string, payload: any) => void; };

export function createWsServer(server: any): WebSocketHub {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const clients = new Set<ClientInfo>();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token') || '';
    const client: ClientInfo = { ws, userId: null, subs: new Set() };
    clients.add(client);

    const send = (o:any) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(o)); };

    if (token) { try { const d = jwt.verify(token, CONFIG.jwtSecret) as any; client.userId = d.id; } catch {} }

    ws.on('message', raw => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === 'auth' && typeof msg.token === 'string') {
          try { const d = jwt.verify(msg.token, CONFIG.jwtSecret) as any; client.userId = d.id; return send({ type:'auth_ok' }); }
          catch { return send({ type:'auth_err' }); }
        }
        if (msg.type === 'subscribe' && Array.isArray(msg.symbols)) {
          msg.symbols.forEach((s:string)=>client.subs.add(String(s).toUpperCase()));
          return send({ type:'subscribed', symbols:[...client.subs] });
        }
        if (msg.type === 'unsubscribe' && Array.isArray(msg.symbols)) {
          msg.symbols.forEach((s:string)=>client.subs.delete(String(s).toUpperCase()));
          return send({ type:'subscribed', symbols:[...client.subs] });
        }
      } catch {}
    });

    ws.on('close', () => clients.delete(client));
  });

  return {
    notifyUser(userId, msg) {
      for (const c of clients) if (c.userId === userId && c.ws.readyState === WebSocket.OPEN) c.ws.send(JSON.stringify(msg));
    },
    broadcastPrice(symbol, payload) {
      const sym = symbol.toUpperCase();
      for (const c of clients) if (c.subs.has(sym) && c.ws.readyState === WebSocket.OPEN) c.ws.send(JSON.stringify({ type:'price', payload }));
    }
  };
}
