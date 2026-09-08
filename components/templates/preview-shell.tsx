'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TemplateRenderer } from './renderer'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import { getTemplate, TEMPLATES } from '@/lib/templates'
import type { Profile } from '@/lib/schema'
import type { FixtureKey } from '@/lib/fixtures'
import { cn } from '@/lib/cn'

/**
 * Preview chrome around a real template render. The template strip switches
 * without a reload so the student sees continuity — Phase 3 upgrades this
 * crossfade to the FLIP transition on the hero card.
 */
export function PreviewShell({
  templateId,
  profile,
  fixtureKey,
}: {
  templateId: string
  profile: Profile
  fixtureKey: FixtureKey
}) {
  const { lang } = useLang()
  const template = getTemplate(templateId)
  const shown: Profile = { ...profile, templateId }

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-strong)] backdrop-blur-md">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <Link
            href="/gallery"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium"
          >
            <ArrowRight size={17} className="icon-flip" aria-hidden="true" />
            كل القوالب
          </Link>

          <nav aria-label="تبديل القالب" className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/preview/${tpl.id}?fixture=${fixtureKey}`}
                aria-current={tpl.id === templateId ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-[var(--nq-radius-md)] border px-3 text-sm font-medium transition-colors duration-200',
                  tpl.id === templateId
                    ? 'border-transparent'
                    : 'border-[var(--nq-border)] hover:border-[var(--nq-border-strong)]'
                )}
                style={
                  tpl.id === templateId
                    ? { background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }
                    : undefined
                }
              >
                {tpl.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={`/preview/${templateId}?fixture=${fixtureKey === 'full' ? 'no-experience' : 'full'}`}
              className="inline-flex min-h-11 items-center rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] px-3 text-sm"
            >
              {fixtureKey === 'full' ? 'جرّب: بلا خبرة' : 'جرّب: سيرة كاملة'}
            </Link>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <TemplateRenderer profile={shown} template={template} lang={lang} />
    </>
  )
}
