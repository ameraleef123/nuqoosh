import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/templates/public-shell'
import { fixtures } from '@/lib/fixtures'
import { findByHandle } from '@/lib/db/profiles'
import { text } from '@/lib/i18n'
import type { Profile } from '@/lib/schema'

/**
 * The public page — `/{handle}`.
 *
 * The two fixtures are prerendered at build time and stay as the design's
 * reference pages. Every other handle is looked up in the database on first
 * request, cached, and refreshed by `revalidatePath` whenever its owner saves
 * — so a recruiter never waits on a query and an edit shows within seconds.
 *
 * Handles resolve from BOTH the Arabic handle and its Latin twin, because chat
 * apps percent-encode Arabic URLs when they are copied and the recruiter would
 * see a wall of %D9%85.
 */

const FIXTURES: Profile[] = Object.values(fixtures)

export const dynamicParams = true

async function findProfile(handle: string): Promise<Profile | null> {
  const decoded = decodeURIComponent(handle)
  const fixture = FIXTURES.find((p) => p.handle === decoded || p.latinHandle === decoded)
  if (fixture) return fixture
  if (!process.env.DATABASE_URL) return null
  const row = await findByHandle(decoded)
  // Drafts and moderated pages are not public; both read as "no such page".
  if (!row || row.status !== 'published') return null
  return row.data
}

export function generateStaticParams() {
  return FIXTURES.flatMap((p) => [{ handle: p.latinHandle }, { handle: p.handle }])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const profile = await findProfile(handle)
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
  const profile = await findProfile(handle)
  if (!profile) notFound()

  return <PublicShell profile={profile} />
}
