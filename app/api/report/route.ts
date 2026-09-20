import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { findByHandle } from '@/lib/db/profiles'

export const runtime = 'nodejs'

/** POST { handle, reason } → { ok }. Read by a person; nothing is auto-hidden. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const handle = typeof body?.handle === 'string' ? body.handle : ''
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 1000) : ''
  if (!handle || reason.length < 3) return NextResponse.json({ error: 'اكتب سبب قصير.' }, { status: 400 })
  const row = await findByHandle(handle)
  if (!row) return NextResponse.json({ error: 'الصفحة مش موجودة.' }, { status: 404 })
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
  const reporterHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 32) : null
  await db().insert(reports).values({ profileId: row.id, reason, reporterHash })
  return NextResponse.json({ ok: true })
}
