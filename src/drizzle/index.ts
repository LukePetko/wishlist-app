import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import ENV from '@/lib/env';

const pool = new Pool({
  connectionString: ENV.DB_URL,
});

export const db = drizzle(pool, { schema });
