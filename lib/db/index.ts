import 'server-only'
import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * One Drizzle instance over Neon's HTTP driver: no connection pool to keep
 * warm, which is what a Vercel function wants. Created lazily so `next build`
 * (which prerenders pages that never touch the database) works with no
 * DATABASE_URL, and so a missing variable fails with a sentence, not a stack.
 */

let cached: NeonHttpDatabase<typeof schema> | null = null

export function db(): NeonHttpDatabase<typeof schema> {
  if (cached) return cached
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Put the Neon connection string in .env.local (and in Vercel → Settings → Environment Variables).'
    )
  }
  cached = drizzle(neon(url), { schema })
  return cached
}

export { schema }
