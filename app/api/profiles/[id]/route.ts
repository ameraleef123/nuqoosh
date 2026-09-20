import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/schema'
import { findById, updateProfile } from '@/lib/db/profiles'
import { tokenMatches } from '@/lib/publish/token'

export const runtime = 'nodejs'

/**
 * The owner's routes, both gated by the edit token in `x-edit-token`.
 *   GET  → { profile }               (loads the page back into the editor)
 *   PUT  { profile } → { ok: true }  (replaces it; handles stay as they are)
 */

async function authed(req: Request, id: string) {
  const row = await findById(id)
  if (!row) return { error: NextResponse.json({ error: 'الصفحة مش موجودة.' }, { status: 404 }) }
  if (!tokenMatches(req.headers.get('x-edit-token'), row.editTokenHash)) {
    return { error: NextResponse.json({ error: 'رابط التعديل مش صحيح.' }, { status: 403 }) }
  }
  return { row }
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const { row, error } = await authed(req, id)
  if (error) return error
  return NextResponse.json({ profile: row.data, status: row.status })
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const { row, error } = await authed(req, id)
  if (error) return error
  const body = await req.json().catch(() => null)
  const parsed = profileSchema.safeParse(body?.profile)
  if (!parsed.success) return NextResponse.json({ error: 'في شي ناقص بالصفحة.' }, { status: 400 })
  // Handles are permanent: whatever the client sent, the row's pair wins.
  const next = { ...parsed.data, handle: row.handle, latinHandle: row.latinHandle }
  try {
    await updateProfile(id, next)
    revalidatePath(`/${row.latinHandle}`)
    revalidatePath(`/${row.handle}`)
    return NextResponse.json({ ok: true, handle: row.handle, latinHandle: row.latinHandle })
  } catch (err) {
    console.error('[profiles:put] failed:', err)
    return NextResponse.json({ error: 'ما انحفظ التعديل. جرّب بعد شوي.' }, { status: 500 })
  }
}
