// client.ts
//
// Singleton Turso client for all DB access. Used by lib/db/images and lib/db/users.
//
import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

/**
 * Returns the shared Turso client. Throws if TURSO_DATABASE_URL is not set.
 */
export function getDb(): Client {
  if (_db) return _db;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  _db = createClient({
    url,
    authToken: authToken || undefined,
  });
  return _db;
}
