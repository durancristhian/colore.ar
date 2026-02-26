// images.ts
//
// CRUD for the images table. Ensures the table exists on first use.
// Used by app/api/images and app/api/images/[id].
//
import { getDb } from "./client";

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  source_image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
`;

let initialized = false;

async function ensureTable(): Promise<void> {
  if (initialized) return;
  await getDb().execute(INIT_SQL);
  initialized = true;
}

export interface InsertImageParams {
  id: string;
  userId: string;
  description?: string | null;
  imageUrl: string;
  sourceImageUrl?: string | null;
}

/**
 * Inserts one image row. ensureTable is called internally.
 */
export async function insertImage(params: InsertImageParams): Promise<void> {
  await ensureTable();
  const db = getDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO images (id, user_id, description, image_url, source_image_url, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      params.id,
      params.userId,
      params.description ?? null,
      params.imageUrl,
      params.sourceImageUrl ?? null,
      now,
      now,
    ],
  });
}

export interface ImageRow {
  id: string;
  description: string | null;
  imageUrl: string;
  sourceImageUrl: string | null;
  createdAt: string;
}

/**
 * Returns the image if it exists and is owned by userId; otherwise null.
 */
export async function getImageByIdAndUserId(
  id: string,
  userId: string,
): Promise<ImageRow | null> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: `SELECT id, description, image_url, source_image_url, created_at FROM images WHERE id = ? AND user_id = ?`,
    args: [id, userId],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0];
  return {
    id: String(row.id),
    description: row.description != null ? String(row.description) : null,
    imageUrl: String(row.image_url),
    sourceImageUrl:
      row.source_image_url != null ? String(row.source_image_url) : null,
    createdAt: String(row.created_at),
  };
}

/**
 * Returns all images for the user, newest first; empty array if none.
 */
export async function listImagesByUserId(userId: string): Promise<ImageRow[]> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: `SELECT id, description, image_url, source_image_url, created_at FROM images
          WHERE user_id = ?
          ORDER BY created_at DESC`,
    args: [userId],
  });
  return rs.rows.map((row) => ({
    id: String(row.id),
    description: row.description != null ? String(row.description) : null,
    imageUrl: String(row.image_url),
    sourceImageUrl:
      row.source_image_url != null ? String(row.source_image_url) : null,
    createdAt: String(row.created_at),
  }));
}

/**
 * Deletes the image if it exists and is owned by userId. Returns true iff a row was deleted.
 */
export async function deleteImageByIdAndUserId(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: "DELETE FROM images WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return (rs.rowsAffected ?? 0) > 0;
}
