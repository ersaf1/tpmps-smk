import "server-only";
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function dbQuery<R extends QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<QueryResult<R>> {
  const p = getDbPool();
  if (!p) {
    throw new Error("DATABASE_URL belum dikonfigurasi pada server");
  }
  return p.query<R>(text, params);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const p = getDbPool();
  if (!p) {
    throw new Error("DATABASE_URL belum dikonfigurasi pada server");
  }
  const client = await p.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
