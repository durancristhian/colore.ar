-- Reference schema for images and users tables. Dates UTC ISO 8601.
-- Actual DDL is in lib/db (CREATE TABLE IF NOT EXISTS).
--
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TRIGGER IF NOT EXISTS update_user_credits_after_insert
AFTER INSERT ON credit_transactions
BEGIN
  UPDATE users 
  SET credits = credits + NEW.amount 
  WHERE user_id = NEW.user_id;
END;

