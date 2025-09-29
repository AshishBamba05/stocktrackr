import { redis } from '../redis';
import { priceStream } from './provider';

export const PRICE_CHANNEL = 'price_updates';

export async function startPriceIngest(symbols: string[]) {
  (async () => {
    for await (const batch of priceStream(symbols, 1000)) {
      for (const { symbol, price, ts } of batch) {
        await redis.set(`price:${symbol}`, String(price));
        await redis.set(`price:ts:${symbol}`, String(ts));
        await redis.publish(PRICE_CHANNEL, JSON.stringify({ symbol, price, ts }));
      }
    }
  })();
}
