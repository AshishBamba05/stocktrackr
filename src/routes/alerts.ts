import { Router } from 'express';
import { db } from '../db';
import { AuthedRequest, authMiddleware } from '../auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthedRequest, res) => {
  const r = await db.query(
    'SELECT id, symbol, direction, target::float8 AS target, last_state, last_triggered_at FROM alerts WHERE user_id=$1 ORDER BY id DESC',
    [req.user!.id]
  );
  res.json(r.rows);
});

router.post('/', async (req: AuthedRequest, res) => {
  const { symbol, direction, target } = req.body ?? {};
  if (!symbol || !['gte','lte'].includes(direction) || target == null)
    return res.status(400).json({ error: 'symbol, direction (gte|lte), target required' });
  const r = await db.query(
    'INSERT INTO alerts(user_id, symbol, direction, target) VALUES($1,$2,$3,$4) RETURNING *',
    [req.user!.id, String(symbol).toUpperCase(), direction, target]
  );
  res.json(r.rows[0]);
});

router.delete('/:id', async (req: AuthedRequest, res) => {
  await db.query('DELETE FROM alerts WHERE id=$1 AND user_id=$2', [req.params.id, req.user!.id]);
  res.json({ ok: true });
});

export default router;
