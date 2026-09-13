import { Pool } from "pg";
declare global { var sfxPool: Pool | undefined; }
export const pool = global.sfxPool ?? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
if (process.env.NODE_ENV !== "production") global.sfxPool = pool;
