import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { initDb } from "@/lib/init-db";
export async function GET(req:Request){
 await initDb(); const u=new URL(req.url), c=u.searchParams.get("category"), t=u.searchParams.get("trending"), q=u.searchParams.get("search");
 const vals:string[]=[]; const wh:string[]=[];
 if(c){vals.push(c);wh.push(`category=$${vals.length}`)} if(t==="true")wh.push("trending=TRUE");
 if(q){vals.push(`%${q}%`);wh.push(`(title ILIKE $${vals.length} OR category ILIKE $${vals.length})`)}
 const r=await pool.query(`SELECT * FROM sounds ${wh.length?"WHERE "+wh.join(" AND "):""} ORDER BY created_at DESC`,vals); return NextResponse.json(r.rows);
}
export async function POST(req:Request){
 await initDb(); const f=await req.formData(), file=f.get("file"), title=String(f.get("title")||"").trim(), category=String(f.get("category")||"").trim(), desc=String(f.get("description")||"").trim(), trending=String(f.get("trending")||"")==="true";
 if(!(file instanceof File)||!title||!category)return NextResponse.json({error:"Title, category and audio file are required."},{status:400});
 if(!file.type.startsWith("audio/"))return NextResponse.json({error:"Please upload an audio file."},{status:400});
 const blob=await put(`sounds/${Date.now()}-${file.name}`,file,{access:"public",addRandomSuffix:true});
 const r=await pool.query(`INSERT INTO sounds(title,category,description,file_url,file_name,trending) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[title,category,desc,blob.url,file.name,trending]);
 return NextResponse.json(r.rows[0],{status:201});
}
