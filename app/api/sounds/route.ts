import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { pool } from "../../../lib/db";
import { initDb } from "../../../lib/init-db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await initDb();
    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const category = String(form.get("category") || "Other").trim();
    const file = form.get("file");

    if (!title) return NextResponse.json({error:"Title is required."},{status:400});
    if (!(file instanceof File)) return NextResponse.json({error:"Audio file is required."},{status:400});
    if (file.size > 25 * 1024 * 1024) return NextResponse.json({error:"Maximum file size is 25 MB."},{status:400});
    if (!file.type.startsWith("audio/")) return NextResponse.json({error:"Only audio files are allowed."},{status:400});
    if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({error:"BLOB_READ_WRITE_TOKEN is not configured in Vercel."},{status:500});

    const blob = await put(`sounds/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`, file, {
      access: "public",
      addRandomSuffix: true
    });

    const result = await pool.query(
      `INSERT INTO sounds(title,category,file_url,file_name) VALUES($1,$2,$3,$4)
       RETURNING id,title,category,file_url,file_name,downloads,created_at`,
      [title,category,blob.url,file.name]
    );
    return NextResponse.json({sound:result.rows[0]});
  } catch (e) {
    console.error(e);
    return NextResponse.json({error:"Upload failed. Check DATABASE_URL and BLOB_READ_WRITE_TOKEN."},{status:500});
  }
}