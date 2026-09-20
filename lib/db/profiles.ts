import 'server-only'
import { eq, or } from 'drizzle-orm'
import { db } from './index'
import { now, profiles, type ProfileRow } from './schema'
import { profileSchema, type Profile } from '@/lib/schema'

/**
 * The few queries the app needs. Every write goes through `profileSchema`
 * first, so a row can never hold a shape the renderer does not understand.
 */

/** Resolves either handle — the Arabic one or its Latin twin. */
export async function findByHandle(handle: string): Promise<ProfileRow | null> {
  const decoded = decodeURIComponent(handle)
  const rows = await db()
    .select()
    .from(profiles)
    .where(or(eq(profiles.handle, decoded), eq(profiles.latinHandle, decoded)))
    .limit(1)
  return rows[0] ?? null
}

export async function findById(id: string): Promise<ProfileRow | null> {
  const rows = await db().select().from(profiles).where(eq(profiles.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createProfile(input: Profile, editTokenHash: string): Promise<ProfileRow> {
  const data = profileSchema.parse(input)
  const [row] = await db()
    .insert(profiles)
    .values({ handle: data.handle, latinHandle: data.latinHandle, editTokenHash, data })
    .returning()
  return row
}

export async function updateProfile(id: string, input: Profile): Promise<ProfileRow | null> {
  const data = profileSchema.parse(input)
  const [row] = await db()
    .update(profiles)
    .set({ data, updatedAt: now })
    .where(eq(profiles.id, id))
    .returning()
  return row ?? null
}

export async function setStatus(id: string, status: ProfileRow['status']): Promise<void> {
  await db()
    .update(profiles)
    .set({ status, updatedAt: now, ...(status === 'published' ? { publishedAt: now } : {}) })
    .where(eq(profiles.id, id))
}

/** True when neither handle is taken. */
export async function handlesFree(handle: string, latinHandle: string): Promise<boolean> {
  const rows = await db()
    .select({ id: profiles.id })
    .from(profiles)
    .where(or(eq(profiles.handle, handle), eq(profiles.latinHandle, latinHandle)))
    .limit(1)
  return rows.length === 0
}
