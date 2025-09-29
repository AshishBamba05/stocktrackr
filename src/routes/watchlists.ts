import { Router } from 'express';
import { db } from '../db';
import { AuthedRequest, authMiddleware } from '../auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthedRequest, res) => {
  const r = await db.query(
    `SELECT w.id, w.name,
            COALESCE(json_agg(wi.symbol) FILTER (WHERE wi.symbol IS NOT NULL), '[]') AS symbols
     FROM watchlists w
     LEFT JOIN watchlist_items wi ON wi.watchlist_id = w.id
     WHERE w.user_id=$1
     GROUP BY w.id
     ORDER BY w.id DESC`,
    [req.user!.id]
  );
  res.json(r.rows);
});

router.post('/', async (req: AuthedRequest, res) => {
  const { name } = req.body ?? {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const r = await db.query('INSERT INTO watchlists(user_id, name) VALUES($1,$2) RETURNING id,name',[req.user!.id,name]);
  res.json(r.rows[0]);
});

router.post('/:id/items', async (req: AuthedRequest, res) => {
  const { symbol } = req.body ?? {};
  if (!symbol) return res.status(400).json({ error: 'symbol required' });
  await db.query('INSERT INTO watchlist_items(watchlist_id, symbol) VALUES($1,$2) ON CONFLICT DO NOTHING',
    [req.params.id, String(symbol).toUpperCase()]);
  res.json({ ok: true });
});

router.delete('/:id/items/:symbol', async (req: AuthedRequest, res) => {
  await db.query('DELETE FROM watchlist_items WHERE watchlist_id=$1 AND symbol=$2',
    [req.params.id, String(req.params.symbol).toUpperCase()]);
  res.json({ ok: true });
});

export default router;
