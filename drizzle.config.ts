import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

// `npm run db:push` reads DATABASE_URL from .env.local (loaded below) and
// creates or alters the tables in lib/db/schema.ts. No SQL files to keep.
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
})
