import 'dotenv/config';
export const CONFIG = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  dbUrl: process.env.DATABASE_URL || 'postgres://stock:stock@localhost:5432/stocktrackr',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
};
