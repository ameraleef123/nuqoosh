'use client'

/**
 * Template gallery — `/gallery`.
 *
 * The student picks a feeling, not a layout number. Each built template gets a
 * full-bleed band painted in its own background system, so the page itself is
 * the argument: you scroll through four moods rather than four thumbnails.
 *
 * Every band previews the same real profile — the no-experience one by default,
 * because that is the case every template has to survive.
 */

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TemplateThumb } from '@/components/templates/thumbnail'
import { useTilt } from '@/components/templates/renderer'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import { Wordmark } from '@/components/ui'
import { fixtures, type FixtureKey } from '@/lib/fixtures'
import { PLANNED, TEMPLATES, TOTAL_TEMPLATES, type Template } from '@/lib/templates'

/* ── One full-width band per template ──────────────────────────────────────
   The band carries `data-template`, so every token, font, glass value and
   background inside it comes from that template rather than from the gallery
   chrome. `data-motion-sig` gives it that template's depth character.
   ────────────────────────────────────────────────────────────────────────── */

function TemplateBand({
  template,
  fixture,
  lang,
}: {
  template: Template
  fixture: FixtureKey
  lang: ReturnType<typeof useLang>['lang']
}) {
  const profile = { ...fixtures[fixture], templateId: template.id }
  const scope = useRef<HTMLElement>(null)
  useTilt(scope)

  return (
    <section
      ref={scope}
      className="tpl overflow-hidden"
      data-template={template.id}
      data-motion-sig={template.motion}
      data-preview="true"
    >
      <div className="tpl-bg" data-bg={template.background} aria-hidden="true">
        {template.background === 'dawn' ? <span className="tpl-sky" /> : null}
        <span
          className="orb"
          data-orb="1"
          style={{
            inlineSize: '55%',
            blockSize: '170%',
            insetInlineStart: '-12%',
            insetBlockStart: '-35%',
            ['--orb-duration' as string]: '30s',
          }}
        />
        <span
          className="orb"
          data-orb="2"
          style={{
            inlineSize: '45%',
            blockSize: '150%',
            insetInlineEnd: '-10%',
            insetBlockStart: '-25%',
            ['--orb-duration' as string]: '26s',
          }}
        />
        <span
          className="orb"
          data-orb="3"
          style={{
            inlineSize: '40%',
            blockSize: '130%',
            insetInlineStart: '35%',
            insetBlockEnd: '-45%',
            ['--orb-duration' as string]: '34s',
          }}
        />
      </div>

      <div className="tpl-content container-page grid items-center gap-8 py-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:py-20">
        <div data-reveal>
          {/* The meta text has no panel of its own by default, so it is read
              straight against the orbs: measured 4.46:1 on فجر's name and
              2.84:1 on its mood, both failures. Rather than inventing a scrim,
              it gets the design system's own surface — .glass — which measures
              6.32:1 at worst across all eight band/theme combinations. */}
          <div className="glass tilt rounded-[var(--nq-radius-lg)] p-6 md:p-8" data-tilt>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2
                className="text-[clamp(2.5rem,6vw,4rem)] font-extrabold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {template.name}
              </h2>
              <span className="text-[var(--nq-muted-foreground)] text-sm">
                {template.lean === 'light' ? 'فاتح' : 'داكن'}
                {template.free ? ' · مجاني' : ' · ضمن الخطة المدفوعة'}
              </span>
            </div>

            <p className="text-[var(--nq-muted-foreground)] mt-2 max-w-md text-lg">
              {template.mood}
            </p>

            <Link
              href={`/preview/${template.id}?fixture=${fixture}`}
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--nq-radius-md)] px-5 font-semibold"
              style={{ background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }}
            >
              جرّبه بحجمه الكامل
              <ArrowUpRight size={17} className="icon-flip" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div data-reveal>
          {/* Tilt sits on an inner wrapper so it never fights the reveal's
              own transform. */}
          <div className="tilt" data-tilt>
            <TemplateThumb template={template} profile={profile} lang={lang} variant="wide" />
          </div>
        </div>
      </div>
    </section>
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
      <header className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-strong)] backdrop-blur-md">
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

      <main>
        <div className="container-page py-10 md:py-14">
          <h1 className="mb-2 text-[clamp(2rem,5vw,3rem)] font-extrabold">اختار إحساس، مش رقم</h1>
          <p className="text-[var(--nq-muted-foreground)] mb-6 max-w-2xl text-lg">
            كل قالب له اسم وإحساس. المعاينة بمعلومات طالبة حقيقية بلا أي خبرة عمل — لأنّ هاي
            الحالة اللي لازم كل قالب ينجح فيها أوّلًا.
          </p>

          {/* Fixture switch: prove the templates on the hard case first. */}
          <div
            className="inline-flex rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] p-1"
            role="group"
            aria-label="اختيار البيانات التجريبية"
          >
            {(Object.keys(FIXTURE_LABEL) as FixtureKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFixture(k)}
                aria-pressed={fixture === k}
                className="min-h-11 rounded-[var(--nq-radius-sm)] px-4 text-sm font-medium transition-colors duration-200"
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
        </div>

        {TEMPLATES.map((tpl) => (
          <TemplateBand key={tpl.id} template={tpl} fixture={fixture} lang={lang} />
        ))}

        {/* The rest of the 28, named honestly as not yet built. */}
        <section className="container-page py-14">
          <h2 className="heading-rule mb-2 text-2xl">باقي القوالب</h2>
          <p className="text-[var(--nq-muted-foreground)] mb-6">
            {TEMPLATES.length} من {TOTAL_TEMPLATES} مبنيّة. هاي هويّات باقي القوالب، بتنبنى على
            دفعات بالمرحلة الخامسة.
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
