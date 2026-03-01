// client.ts
//
// Singleton Turso client for all DB access. Used by lib/db/images and lib/db/users.
//
import { createClient, type Client } from "@libsql/client";
import { env } from "@/lib/env.server";

let _db: Client | null = null;

/**
 * Returns the shared Turso client. Throws if TURSO_DATABASE_URL is not set.
 */
export function getDb(): Client {
  if (_db) return _db;
  _db = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return _db;
}

/**
 * Simplified factory to create a thread-safe "ensure table" function.
 * Ensures the provided SQL (usually CREATE TABLE IF NOT EXISTS) is only executed once.
 */
export function createEnsurer(initSql: string): () => Promise<void> {
  let initPromise: Promise<void> | null = null;

  return async function ensureTable(): Promise<void> {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      await getDb().execute(initSql);
    })();
    return initPromise;
  };
}
