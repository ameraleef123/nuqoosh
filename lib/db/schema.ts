import { sql } from 'drizzle-orm'
import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { Profile } from '@/lib/schema'

/**
 * Two tables. The profile itself is stored as one JSON document validated by
 * `profileSchema` (lib/schema.ts) on every write, so the shape has ONE owner
 * and adding a wizard field never needs a migration. Columns exist only for
 * what the database must look up or enforce: the two handles, the edit-token
 * hash, and moderation state.
 */

export const profileStatus = pgEnum('profile_status', ['draft', 'published', 'hidden'])

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Arabic handle — the link the student is proud of. Permanent. */
    handle: text('handle').notNull().unique(),
    /** Latin twin — chat apps percent-encode Arabic URLs on copy. Permanent. */
    latinHandle: text('latin_handle').notNull().unique(),
    /** SHA-256 of the edit token. The plaintext is shown once and never stored. */
    editTokenHash: text('edit_token_hash').notNull(),
    status: profileStatus('status').notNull().default('draft'),
    data: jsonb('data').$type<Profile>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
  },
  (t) => [index('profiles_status_idx').on(t.status)]
)

/** «الإبلاغ عن هذه الصفحة». Read by a human; never auto-hides. */
export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    /** Hashed reporter IP, to rate-limit without keeping an address. */
    reporterHash: text('reporter_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('reports_profile_idx').on(t.profileId)]
)

export type ProfileRow = typeof profiles.$inferSelect
export type ReportRow = typeof reports.$inferSelect

/** For `updated_at = now()` in update statements. */
export const now = sql`now()`
