import { notFound } from 'next/navigation'
import { PreviewShell } from '@/components/templates/preview-shell'
import { TEMPLATES } from '@/lib/templates'
import { fixtures, type FixtureKey } from '@/lib/fixtures'

/**
 * Full-size template preview — `/preview/{templateId}?fixture=no-experience`.
 *
 * A builder route: the student sees a candidate template at their real viewport
 * with their own data before choosing it. Locked templates stay previewable;
 * the lock only appears at publish (Phase 4).
 */

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ template: t.id }))
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ template: string }>
  searchParams: Promise<{ fixture?: string }>
}) {
  const { template } = await params
  const { fixture } = await searchParams

  if (!TEMPLATES.some((t) => t.id === template)) notFound()

  const key: FixtureKey = fixture === 'full' ? 'full' : 'no-experience'
  return <PreviewShell templateId={template} profile={fixtures[key]} fixtureKey={key} />
}
