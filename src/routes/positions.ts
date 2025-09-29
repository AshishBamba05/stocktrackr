import { Router } from 'express';
import { db } from '../db';
import { AuthedRequest, authMiddleware } from '../auth';
import { redis } from '../redis';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthedRequest, res) => {
  const r = await db.query(
    'SELECT symbol, quantity::float8 AS quantity, avg_cost::float8 AS avg_cost FROM positions WHERE user_id=$1',
    [req.user!.id]
  );
  const out:any[] = [];
  for (const p of r.rows) {
    const price = Number(await redis.get(`price:${p.symbol}`)) || null;
    const pnl = price != null ? (price - p.avg_cost) * p.quantity : null;
    const pnlPct = price != null ? ((price - p.avg_cost) / p.avg_cost) * 100 : null;
    out.push({ ...p, price, pnl, pnlPct });
  }
  res.json(out);
});

router.post('/', async (req: AuthedRequest, res) => {
  const { symbol, quantity, avg_cost } = req.body ?? {};
  if (!symbol || quantity == null || avg_cost == null) return res.status(400).json({ error: 'symbol, quantity, avg_cost required' });
  const r = await db.query(
    `INSERT INTO positions(user_id, symbol, quantity, avg_cost)
     VALUES($1,$2,$3,$4)
     ON CONFLICT(user_id, symbol) DO UPDATE SET quantity=EXCLUDED.quantity, avg_cost=EXCLUDED.avg_cost
     RETURNING symbol, quantity::float8 AS quantity, avg_cost::float8 AS avg_cost`,
    [req.user!.id, String(symbol).toUpperCase(), quantity, avg_cost]
  );
  res.json(r.rows[0]);
});

export default router;
