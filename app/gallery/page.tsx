'use client'

/**
 * Template gallery — `/gallery`.
 *
 * The student picks a feeling, not a layout number. Every card shows the mood
 * name, one line about how it should feel, and a live preview rendered with a
 * real profile — the no-experience one by default, because that is the case
 * every template has to survive.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TemplateThumb } from '@/components/templates/thumbnail'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import { Wordmark } from '@/components/ui'
import { fixtures, type FixtureKey } from '@/lib/fixtures'
import { PLANNED, TEMPLATES, TOTAL_TEMPLATES, type Template } from '@/lib/templates'
import { cn } from '@/lib/cn'

function PreviewCard({
  template,
  fixture,
  lang,
}: {
  template: Template
  fixture: FixtureKey
  lang: ReturnType<typeof useLang>['lang']
}) {
  const profile = { ...fixtures[fixture], templateId: template.id }

  return (
    <li className="glass overflow-hidden rounded-[var(--nq-radius-lg)]">
      {/* Fixed aspect box so the grid never shifts while previews paint. */}
      <div className="relative aspect-[3/4] overflow-hidden border-b border-[var(--nq-border)]">
        <TemplateThumb template={template} profile={profile} lang={lang} />
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">{template.name}</h2>
          <span className="text-[var(--nq-muted-foreground)] text-xs">
            {template.lean === 'light' ? 'فاتح' : 'داكن'}
            {template.free ? ' · مجاني' : ''}
          </span>
        </div>
        <p className="text-[var(--nq-muted-foreground)] mt-1">{template.mood}</p>

        <Link
          href={`/preview/${template.id}?fixture=${fixture}`}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--nq-radius-md)] px-4 text-sm font-semibold"
          style={{ background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }}
        >
          جرّبه بحجمه الكامل
          <ArrowUpRight size={16} className="icon-flip" aria-hidden="true" />
        </Link>
      </div>
    </li>
  )
}

export default function GalleryPage() {
  const { lang } = useLang()
  const [fixture, setFixture] = useState<FixtureKey>('no-experience')

  const FIXTURE_LABEL: Record<FixtureKey, string> = {
    'no-experience': 'بلا خبرة',
    full: 'سيرة كاملة',
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-subtle)] backdrop-blur-md">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Wordmark withLatin />
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container-page py-10 md:py-16">
        <h1 className="mb-2 text-[clamp(2rem,5vw,3rem)] font-extrabold">اختار إحساس، مش رقم</h1>
        <p className="text-[var(--nq-muted-foreground)] mb-6 max-w-2xl text-lg">
          كل قالب له اسم وإحساس. المعاينة تحت بمعلومات طالبة حقيقية بلا أي خبرة عمل —
          لأنّ هاي الحالة اللي لازم كل قالب ينجح فيها أوّلًا.
        </p>

        {/* Fixture switch: prove the templates on the hard case first. */}
        <div
          className="mb-8 inline-flex rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] p-1"
          role="group"
          aria-label="اختيار البيانات التجريبية"
        >
          {(Object.keys(FIXTURE_LABEL) as FixtureKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFixture(k)}
              aria-pressed={fixture === k}
              className={cn(
                'min-h-11 rounded-[var(--nq-radius-sm)] px-4 text-sm font-medium transition-colors duration-200'
              )}
              style={
                fixture === k
                  ? { background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }
                  : undefined
              }
            >
              {FIXTURE_LABEL[k]}
            </button>
          ))}
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {TEMPLATES.map((tpl) => (
            <PreviewCard key={tpl.id} template={tpl} fixture={fixture} lang={lang} />
          ))}
        </ul>

        {/* The rest of the 28, named honestly as not yet built. */}
        <section className="mt-16">
          <h2 className="heading-rule mb-2 text-2xl">باقي القوالب</h2>
          <p className="text-[var(--nq-muted-foreground)] mb-6">
            {TEMPLATES.length} من {TOTAL_TEMPLATES} مبنيّة. هاي هويّات باقي القوالب، بتنبنى
            على دفعات بالمرحلة الخامسة.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLANNED.map((p) => (
              <li key={p.id} className="glass-subtle rounded-[var(--nq-radius-md)] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <span className="text-[var(--nq-muted-foreground)] text-xs">
                    {p.lean === 'light' ? 'فاتح' : 'داكن'}
                    {p.free ? ' · مجاني' : ''}
                  </span>
                </div>
                <p className="text-[var(--nq-muted-foreground)] text-sm">{p.mood}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
