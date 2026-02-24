import { getDb } from "./client";

export type UserRole = "admin" | "vip" | "standard";

const ROLES: UserRole[] = ["admin", "vip", "standard"];

function assertRole(value: unknown): UserRole {
  if (typeof value === "string" && ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }
  return "standard";
}

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL
);
`;

let initialized = false;

async function ensureTable(): Promise<void> {
  if (initialized) return;
  await getDb().execute(INIT_SQL);
  initialized = true;
}

export interface UserRow {
  userId: string;
  role: UserRole;
}

export async function getUserById(
  userId: string,
): Promise<{ userId: string; role: UserRole } | null> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT user_id, role FROM users WHERE user_id = ?",
    args: [userId],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0];
  return {
    userId: String(row.user_id),
    role: assertRole(row.role),
  };
}

export async function getOrCreateUser(
  userId: string,
  defaultRole: UserRole = "standard",
): Promise<{ userId: string; role: UserRole }> {
  const existing = await getUserById(userId);
  if (existing) return existing;

  await ensureTable();
  const db = getDb();
  await db.execute({
    sql: "INSERT INTO users (user_id, role) VALUES (?, ?)",
    args: [userId, defaultRole],
  });
  return { userId, role: defaultRole };
}
