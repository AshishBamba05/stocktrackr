import { Pool } from 'pg';
import { CONFIG } from './config';
export const db = new Pool({ connectionString: CONFIG.dbUrl });
