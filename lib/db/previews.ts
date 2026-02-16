import { getDb } from "./client";

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS previews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  description TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

let initialized = false;

async function ensureTable(): Promise<void> {
  if (initialized) return;
  await getDb().execute(INIT_SQL);
  initialized = true;
}

export interface InsertPreviewParams {
  id: string;
  userId: string;
  description: string;
  previewUrl: string;
}

export async function insertPreview(
  params: InsertPreviewParams,
): Promise<void> {
  await ensureTable();
  const db = getDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO previews (id, user_id, description, preview_url, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      params.id,
      params.userId,
      params.description,
      params.previewUrl,
      now,
      now,
    ],
  });
}

export async function getPreviewById(
  id: string,
): Promise<{ previewUrl: string } | null> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT preview_url FROM previews WHERE id = ?",
    args: [id],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0];
  const previewUrl = row.preview_url;
  return typeof previewUrl === "string" ? { previewUrl } : null;
}

export async function getPreviewByIdAndUserId(
  id: string,
  userId: string,
): Promise<{ previewUrl: string } | null> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT preview_url FROM previews WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0];
  const previewUrl = row.preview_url;
  return typeof previewUrl === "string" ? { previewUrl } : null;
}

export async function listPreviewsByUserId(
  userId: string,
): Promise<
  { id: string; description: string; previewUrl: string; createdAt: string }[]
> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: `SELECT id, description, preview_url, created_at FROM previews
          WHERE user_id = ?
          ORDER BY created_at DESC`,
    args: [userId],
  });
  return rs.rows.map((row) => ({
    id: String(row.id),
    description: String(row.description),
    previewUrl: String(row.preview_url),
    createdAt: String(row.created_at),
  }));
}
