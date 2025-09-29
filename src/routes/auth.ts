import { Router } from 'express';
import { db } from '../db';
import { hashPassword, comparePassword, signJwt } from '../auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  const pw = await hashPassword(password);
  try {
    const r = await db.query('INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id,email',[email,pw]);
    const u = r.rows[0];
    res.json({ token: signJwt({ id: u.id, email: u.email }) });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'email exists' });
    res.status(500).json({ error: 'server' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  const r = await db.query('SELECT id,email,password_hash FROM users WHERE email=$1',[email]);
  const u = r.rows[0]; if (!u) return res.status(401).json({ error: 'invalid' });
  const ok = await comparePassword(password, u.password_hash); if (!ok) return res.status(401).json({ error: 'invalid' });
  res.json({ token: signJwt({ id: u.id, email: u.email }) });
});

export default router;
