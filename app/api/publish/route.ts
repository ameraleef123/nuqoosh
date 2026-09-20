import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/schema'
import { createProfile, setStatus } from '@/lib/db/profiles'
import { claimHandles } from '@/lib/publish/handles'
import { hashToken, newEditToken } from '@/lib/publish/token'

export const runtime = 'nodejs'

/**
 * POST { profile } → { id, handle, latinHandle, editToken }
 *
 * One press. The handles are claimed (suffixed if taken), the page goes live,
 * and the edit token is returned exactly once. Errors are Arabic hints for the
 * student; causes go to the server log.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = profileSchema.safeParse(body?.profile)
  if (!parsed.success) {
    return NextResponse.json({ error: 'في شي ناقص بالصفحة — ارجع للمراجعة وكمّل الاسم على الأقل.' }, { status: 400 })
  }
  const profile = parsed.data
  const name = profile.fields.fullName.ar.trim() || profile.fields.fullName.en?.trim()
  if (!name) return NextResponse.json({ error: 'الاسم لازم يكون موجود قبل النشر.' }, { status: 400 })

  try {
    const handles = await claimHandles(profile.handle, profile.latinHandle)
    const editToken = newEditToken()
    const row = await createProfile(
      { ...profile, ...handles, hiddenAt: undefined, editTokenHash: undefined, ownerUserId: undefined },
      hashToken(editToken)
    )
    await setStatus(row.id, 'published')
    revalidatePath(`/${row.latinHandle}`)
    revalidatePath(`/${row.handle}`)
    return NextResponse.json({ id: row.id, handle: row.handle, latinHandle: row.latinHandle, editToken })
  } catch (err) {
    console.error('[publish] failed:', err)
    return NextResponse.json({ error: 'ما قدرنا ننشر هلّق. جرّب بعد شوي.' }, { status: 500 })
  }
}
