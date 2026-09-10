# SFXVault — Full-stack starter

This project keeps the sound-effect website concept and adds a real upload/database foundation.

## Required Vercel Environment Variables

- `DATABASE_URL` — your Neon PostgreSQL connection string.
- `BLOB_READ_WRITE_TOKEN` — a Vercel Blob read/write token.

`DATABASE_URL` should never be committed to GitHub.

## Deployment

1. Push these files to your GitHub repository.
2. In Vercel, import/redeploy the repository.
3. Add both environment variables under Settings → Environment Variables.
4. Redeploy.
5. Open `/` and use the Upload section.

The first database request automatically creates the `sounds` table.

## What works

- Next.js app
- Neon PostgreSQL connection
- Automatic `sounds` table creation
- Audio upload API
- Vercel Blob public audio storage
- Category metadata
- Search/filter
- Audio playback
- Download link

For a production site, add authentication/admin approval, rate limits, file moderation, and stronger validation before allowing public uploads.