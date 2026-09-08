import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/templates/public-shell'
import { fixtures } from '@/lib/fixtures'
import { text } from '@/lib/i18n'
import type { Profile } from '@/lib/schema'

/**
 * The public page — `/{handle}`.
 *
 * Statically generated. Phase 2 sources profiles from the two fixtures; the
 * database lookup replaces `findProfile` in Phase 4 without changing anything
 * else on this route.
 *
 * Handles resolve from BOTH the Arabic handle and its Latin twin, because chat
 * apps percent-encode Arabic URLs when they are copied and the recruiter would
 * see a wall of %D9%85.
 */

const ALL: Profile[] = Object.values(fixtures)

function findProfile(handle: string): Profile | null {
  const decoded = decodeURIComponent(handle)
  return ALL.find((p) => p.handle === decoded || p.latinHandle === decoded) ?? null
}

export function generateStaticParams() {
  return ALL.flatMap((p) => [{ handle: p.latinHandle }, { handle: p.handle }])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const profile = findProfile(handle)
  if (!profile) return { title: 'نُقوش' }

  const name = text(profile.fields.fullName, 'ar')
  const tagline = text(profile.fields.tagline, 'ar')
  return {
    title: `${name} — نُقوش`,
    description: tagline || undefined,
    alternates: { canonical: `/${profile.latinHandle}` },
    openGraph: { title: name, description: tagline || undefined, type: 'profile' },
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const profile = findProfile(handle)

  if (!profile) notFound()

  // Hidden by moderation: a neutral page with the wordmark and nothing else.
  // Phase 6 turns this into a real 410 response.
  if (profile.hiddenAt) notFound()

  return <PublicShell profile={profile} />
}
