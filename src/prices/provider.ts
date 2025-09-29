const startPrices: Record<string, number> = { AAPL: 190, MSFT: 420, GOOG: 160 };
function step(p: number) { return Math.max(1, p + (Math.random() - 0.5) * 0.8); }

export async function* priceStream(symbols: string[], intervalMs = 1000) {
  const state: Record<string, number> = {};
  for (const s of symbols) state[s] = startPrices[s] ?? 100 + Math.random() * 100;
  while (true) {
    for (const s of symbols) state[s] = step(state[s]);
    yield Object.entries(state).map(([symbol, price]) => ({ symbol, price: Number((price as number).toFixed(2)), ts: Date.now() }));
    await new Promise(r => setTimeout(r, intervalMs));
  }
}
