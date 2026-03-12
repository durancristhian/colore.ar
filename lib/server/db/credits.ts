// credits_ledger.ts
//
// Ledger for user credits. Records every transaction and relies on a database trigger
// to mathematically update the users.credits balance.
//
import { randomUUID } from "crypto";
import { createEnsurer, getDb } from "./client";

export type TransactionType = "purchase" | "usage" | "refund" | "grant";

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  createdAt: string;
}

const INIT_SQL = [
  `CREATE TABLE IF NOT EXISTS credit_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );`,
  `CREATE TRIGGER IF NOT EXISTS update_user_credits_after_insert
  AFTER INSERT ON credit_transactions
  BEGIN
    UPDATE users 
    SET credits = credits + NEW.amount 
    WHERE user_id = NEW.user_id;
  END;`,
];

const ensureTable = createEnsurer(INIT_SQL);

/**
 * Records a new credit transaction. The total balance is derived automatically
 * by the database trigger \`update_user_credits_after_insert\`.
 */
export async function recordTransaction({
  userId,
  amount,
  type,
  description = null,
}: {
  userId: string;
  amount: number;
  type: TransactionType;
  description?: string | null;
}) {
  await ensureTable();
  const db = getDb();
  const id = randomUUID();

  await db.execute({
    sql: "INSERT INTO credit_transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)",
    args: [id, userId, amount, type, description],
  });

  return id;
}

/**
 * Retrieves the transaction history for a given user, newest first.
 */
export async function getUserTransactions(
  userId: string,
): Promise<CreditTransaction[]> {
  await ensureTable();
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT id, user_id, amount, type, description, created_at FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });

  return rs.rows.map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    amount: Number(row.amount),
    type: row.type as TransactionType,
    description: row.description ? String(row.description) : null,
    createdAt: String(row.created_at),
  }));
}
