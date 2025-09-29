import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CONFIG } from './config';
import { Request as ExRequest, Response, NextFunction } from 'express';

export async function hashPassword(pw: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
}

export async function comparePassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signJwt(payload: object) {
  return jwt.sign(payload, CONFIG.jwtSecret, { expiresIn: '7d' });
}

// Express 4 friendly way to extend Request
export type AuthedRequest = ExRequest & { user?: { id: number; email: string } };

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const decoded = jwt.verify(header.slice('Bearer '.length), CONFIG.jwtSecret) as any;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
