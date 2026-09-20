import 'server-only'
import { handlesFree } from '@/lib/db/profiles'

/**
 * Handles are permanent, so a collision is settled once, at publish: the
 * pair gets the same numeric suffix («ليان-٢» / `layan-2`) so the two links
 * keep pointing at the same page.
 */
export async function claimHandles(handle: string, latinHandle: string): Promise<{ handle: string; latinHandle: string }> {
  if (await handlesFree(handle, latinHandle)) return { handle, latinHandle }
  for (let n = 2; n < 100; n++) {
    const ar = `${handle}-${new Intl.NumberFormat('ar-JO-u-nu-arab', { useGrouping: false }).format(n)}`
    const la = `${latinHandle}-${n}`.slice(0, 40)
    if (await handlesFree(ar, la)) return { handle: ar, latinHandle: la }
  }
  const rand = Math.random().toString(36).slice(2, 6)
  return { handle: `${handle}-${rand}`, latinHandle: `${latinHandle}-${rand}`.slice(0, 40) }
}
