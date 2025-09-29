import { redisSub } from '../redis';
import { db } from '../db';
import { PRICE_CHANNEL } from '../prices/service';
import type { WebSocketHub } from '../ws';

type PriceMsg = { symbol: string; price: number; ts: number };

export function startAlertEngine(wsHub: WebSocketHub) {
  redisSub.subscribe(PRICE_CHANNEL, (err) => { if (err) console.error('redis sub', err); });
  redisSub.on('message', async (_ch, msg) => {
    const { symbol, price } = JSON.parse(msg) as PriceMsg;
    const { rows } = await db.query(
      'SELECT id, user_id, direction, target::float8 AS target, last_state FROM alerts WHERE symbol=$1',
      [symbol]
    );
    for (const a of rows) {
      const stateNow = price >= a.target ? 'above' : 'below';
      const shouldTrigger =
        (a.direction === 'gte' && stateNow === 'above' && a.last_state !== 'above') ||
        (a.direction === 'lte' && stateNow === 'below' && a.last_state !== 'below');

      if (shouldTrigger) {
        await db.query('UPDATE alerts SET last_state=$1, last_triggered_at=now() WHERE id=$2',[stateNow,a.id]);
        wsHub.notifyUser(a.user_id, { type:'alert', payload:{ id:a.id, symbol, direction:a.direction, target:a.target, price } });
      } else if (a.last_state !== stateNow) {
        await db.query('UPDATE alerts SET last_state=$1 WHERE id=$2',[stateNow,a.id]);
      }
    }
  });
}
