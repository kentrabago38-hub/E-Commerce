import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool (Object Method)
export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000
    });

    // Prevent unhandled pool-level errors from crashing the application or emitting false-positive fatal alarms on idle cleanup
    global._postgresPool.on('error', (err: any) => {
      if (
        err?.message?.includes('Connection terminated') ||
        err?.code === '57P01' ||
        err?.code === 'ECONNRESET' ||
        err?.code === 'EPIPE'
      ) {
        // Harmless idle client pruning by remote PostgreSQL server; pool automatically establishes fresh connection on next query
        return;
      }
      console.warn('[SQL Pool Client Notice]:', err?.message || err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
