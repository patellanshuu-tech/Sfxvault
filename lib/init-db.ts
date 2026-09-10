import { pool } from "./db";

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sounds (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      downloads INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS sounds_category_idx ON sounds(category);
    CREATE INDEX IF NOT EXISTS sounds_created_at_idx ON sounds(created_at DESC);
  `);
}