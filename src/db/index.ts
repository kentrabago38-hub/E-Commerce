import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool (Object Method)
export const createPool = (): Pool | null => {
  if (!process.env.SQL_HOST) {
    return null;
  }
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

// Initialize Drizzle with resilient mock fallback if not configured
let db: NodePgDatabase<typeof schema>;
try {
  const pool = createPool();
  if (pool) {
    db = drizzle(pool, { schema });
  } else {
    throw new Error('SQL_HOST not configured');
  }
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({})
  };
  db = new Proxy({}, {
    get: (_, prop) =>
      prop === 'query'
        ? new Proxy({}, { get: () => noOp })
        : () => ({
            from: () => ({
              where: () => [],
              orderBy: () => [],
              then: (resolve: any) => resolve([])
            }),
            values: () => ({
              returning: () => [],
              then: (resolve: any) => resolve()
            }),
            set: () => ({
              where: () => ({
                then: (resolve: any) => resolve()
              })
            }),
            then: (resolve: any) => resolve([])
          }),
  }) as unknown as NodePgDatabase<typeof schema>;
}

export { db };

