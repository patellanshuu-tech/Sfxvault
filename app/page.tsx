import { pool } from "../lib/db";
import { initDb } from "../lib/init-db";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  let sounds: any[] = [];
  try {
    await initDb();
    const result = await pool.query(
      "SELECT id,title,category,file_url,file_name,downloads,created_at FROM sounds ORDER BY created_at DESC LIMIT 50"
    );
    sounds = result.rows;
  } catch {
    // The UI still renders if DATABASE_URL has not been configured yet.
  }
  return <HomeClient initialSounds={sounds} />;
}