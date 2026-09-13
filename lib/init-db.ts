import { pool } from "./db";
export async function initDb() {
 await pool.query(`CREATE TABLE IF NOT EXISTS sounds (id SERIAL PRIMARY KEY,title TEXT NOT NULL,category TEXT NOT NULL,description TEXT DEFAULT '',file_url TEXT NOT NULL,file_name TEXT NOT NULL,trending BOOLEAN NOT NULL DEFAULT FALSE,downloads INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`);
 await pool.query(`ALTER TABLE sounds ADD COLUMN IF NOT EXISTS trending BOOLEAN NOT NULL DEFAULT FALSE;`);
}
