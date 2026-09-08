'use client'

import { Fragment, useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  AtSign,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Phone,
  Twitter,
} from 'lucide-react'
import type { Profile, LinkKind } from '@/lib/schema'
import { visibleSections, type SectionKey } from '@/lib/profile'
import { formatGpa, formatNumber, resolveField, t, type Lang } from '@/lib/i18n'
import type { Template } from '@/lib/templates'
import { cn } from '@/lib/cn'
import { LottieMark } from '@/components/lottie-mark'

/* ═══════════════════════════════════════════════════════════════════════════
   ONE renderer for every template. Templates are data plus component variants,
   never 28 forks: `template` selects the background, hero layout, card shape,
   section order and motion character; the section logic below is shared.

   Two rules are enforced here and nowhere else, so no template can break them:
     · A section with no content is never rendered — no heading, no gap, no nudge.
     · The phone number is absent from the DOM when the student did not give one.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Bilingual text node ───────────────────────────────────────────────────
   Stamps lang/dir on the node itself, so a field that fell back to Arabic
   inside an English page still renders right-to-left with the Arabic face.
   ────────────────────────────────────────────────────────────────────────── */

function Txt({
  value,
  lang,
  as: Tag = 'span',
  className,
}: {
  value: Parameters<typeof resolveField>[0]
  lang: Lang
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'li'
  className?: string
}) {
  const f = resolveField(value, lang)
  if (!f) return null
  return (
    <Tag className={className} lang={f.lang} dir={f.lang === 'ar' ? 'rtl' : 'ltr'}>
      {f.text}
    </Tag>
  )
}

/* ── Scroll reveal ─────────────────────────────────────────────────────────
   The entire public-route motion layer: about 700 bytes, versus 45 KB gz for
   GSAP + ScrollTrigger, which the measured framework floor cannot afford
   (design-system/nuqush/pages/public.md).
   ────────────────────────────────────────────────────────────────────────── */

function RevealObserver({ scope }: { scope: React.RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const root = scope.current
    if (!root) return

    document.documentElement.dataset.motionReady = '1'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // play on enter, reverse on leave — matches toggleActions
          // 'play none none reverse' from the skill's Scroll Reveal preset.
          e.target.classList.toggle('is-in', e.isIntersecting)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [scope])

  return null
}

/* ── Pointer tilt ──────────────────────────────────────────────────────────
   One delegated listener for the whole page, rAF-throttled, writing only two
   CSS custom properties. The rotation itself is done by CSS (templates.css),
   so JavaScript never touches `transform` and there is nothing to recompute on
   scroll.

   Skipped entirely on touch and under reduced motion, where --tx/--ty stay
   unset and the CSS resolves to no rotation.
   ────────────────────────────────────────────────────────────────────────── */

export function useTilt(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current
    if (!root) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let active: HTMLElement | null = null
    let pointer = { x: 0, y: 0 }

    const clear = (el: HTMLElement | null) => {
      if (!el) return
      el.style.removeProperty('--tx')
      el.style.removeProperty('--ty')
    }

    const apply = () => {
      frame = 0
      if (!active) return
      const r = active.getBoundingClientRect()
      if (!r.width || !r.height) return
      const tx = Math.max(-1, Math.min(1, ((pointer.x - r.left) / r.width) * 2 - 1))
      const ty = Math.max(-1, Math.min(1, ((pointer.y - r.top) / r.height) * 2 - 1))
      active.style.setProperty('--tx', tx.toFixed(3))
      active.style.setProperty('--ty', ty.toFixed(3))
    }

    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-tilt]') : null
      if (target !== active) {
        clear(active)
        active = target
      }
      if (!active) return
      pointer = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      clear(active)
      active = null
    }

    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
      clear(active)
    }
  }, [scope])
}

/* ── Background systems ────────────────────────────────────────────────────
   Three orbs, transform-only drift, paused when the tab is hidden (the
   [data-motion='paused'] rule in globals.css). Colours come from templates.css.
   ────────────────────────────────────────────────────────────────────────── */

function Background({ template }: { template: Template }) {
  const orb = (n: 1 | 2 | 3, style: React.CSSProperties) => (
    <span className="orb" data-orb={n} style={style} key={n} />
  )
  return (
    <div className="tpl-bg" data-bg={template.background} aria-hidden="true">
      {template.background === 'dawn' ? <span className="tpl-sky" /> : null}
      {orb(1, {
        inlineSize: '52vmax',
        blockSize: '52vmax',
        insetInlineStart: '-14vmax',
        insetBlockStart: '-16vmax',
        ['--orb-duration' as string]: '32s',
        ['--orb-dx' as string]: '7%',
        ['--orb-dy' as string]: '6%',
      })}
      {orb(2, {
        inlineSize: '40vmax',
        blockSize: '40vmax',
        insetInlineEnd: '-10vmax',
        insetBlockStart: '8vmax',
        ['--orb-duration' as string]: '28s',
        ['--orb-dx' as string]: '-6%',
        ['--orb-dy' as string]: '9%',
      })}
      {orb(3, {
        inlineSize: '44vmax',
        blockSize: '44vmax',
        insetInlineStart: '18vmax',
        insetBlockEnd: '-20vmax',
        ['--orb-duration' as string]: '36s',
        ['--orb-dx' as string]: '5%',
        ['--orb-dy' as string]: '-7%',
      })}
    </div>
  )
}

/* ── Shared bits ───────────────────────────────────────────────────────────── */

const GLASS: Record<Template['glass'], string> = {
  subtle: 'glass-subtle',
  default: 'glass',
  strong: 'glass-strong',
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--nq-border)] px-2.5 py-0.5 text-sm">
      {children}
    </span>
  )
}

function Badge({ children, tone = 'highlight' }: { children: React.ReactNode; tone?: 'highlight' | 'quiet' }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={
        tone === 'highlight'
          ? { background: 'var(--nq-highlight)', color: 'var(--nq-on-highlight)' }
          : { border: '1px solid var(--nq-border-strong)', color: 'var(--nq-muted-foreground)' }
      }
    >
      {children}
    </span>
  )
}

function SectionShell({
  title,
  glass,
  children,
  wide = false,
}: {
  title: string
  glass: string
  children: React.ReactNode
  /** Spans two columns in a bento layout. */
  wide?: boolean
}) {
  // The reveal animates the outer element and the tilt animates the inner one.
  // Sharing a node would mean two rules writing `transform`, and the reveal's
  // `transform: none` end state would cancel the tilt.
  return (
    <section data-reveal className={wide ? 'bento-wide' : undefined}>
      <div className={cn(GLASS[glass as Template['glass']], 'tilt h-full p-6 md:p-8')} data-tilt>
        {/* At full width a stacked heading leaves short sections — education,
            skills, contact — hugging one edge with a field of empty space
            beside them. Giving the heading its own column fills the card and
            reads as a label/value pair, which is what these sections are. */}
        <div className="grid gap-5 lg:grid-cols-[minmax(9rem,16%)_1fr] lg:gap-10">
          <h2 className="heading-rule text-2xl">{title}</h2>
          <div>{children}</div>
        </div>
      </div>
    </section>
  )
}

/* ── Hero variants ─────────────────────────────────────────────────────────── */

function Hero({ profile, template, lang }: RenderProps) {
  const name = resolveField(profile.fields.fullName, lang)
  const edu = profile.sections.education
  const glass = GLASS[template.glass]

  // Word-level split: Arabic is cursive, so a character split breaks the
  // joining forms and the word stops being readable.
  const words = (name?.text ?? '').split(/\s+/).filter(Boolean)

  const pills = (
    <div className="flex flex-wrap gap-2" data-hero-item>
      {edu?.university ? <Pill>{resolveField(edu.university, lang)?.text}</Pill> : null}
      {edu?.major ? <Pill>{resolveField(edu.major, lang)?.text}</Pill> : null}
      {edu?.year ? (
        <Pill>
          {lang === 'ar' ? 'سنة ' : 'Year '}
          {formatNumber(edu.year, lang)}
        </Pill>
      ) : null}
      {typeof edu?.gpa === 'number' ? (
        <Pill>
          {lang === 'ar' ? 'معدّل ' : 'GPA '}
          {formatGpa(edu.gpa, lang)}
        </Pill>
      ) : null}
    </div>
  )

  const headline = (
    <h1
      className="text-[clamp(2.25rem,7vw,3.75rem)] font-extrabold"
      lang={name?.lang}
      dir={name?.lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {words.map((w, i) => (
        <span className="word" key={`${w}-${i}`}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  )

  const tagline = (
    <Txt
      value={profile.fields.tagline}
      lang={lang}
      as="p"
      className="text-[var(--nq-muted-foreground)] text-lg"
    />
  )

  const about = <Txt value={profile.fields.about} lang={lang} as="p" className="measure" />

  if (template.hero === 'feature') {
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt overflow-hidden')} data-tilt>
        <div className="grid items-stretch lg:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col justify-center gap-5 p-7 md:p-10 lg:p-12">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>
          {art ? (
            <div className="relative min-h-56 border-t border-[var(--nq-border)] lg:min-h-full lg:border-t-0 lg:border-s">
              <LottieMark
                src={art}
                className="absolute inset-0"
                poster={
                  // Holds the space so nothing shifts, and is the whole of it
                  // under reduced motion.
                  <span className="block h-full w-full" />
                }
              />
            </div>
          ) : null}
        </div>
      </header>
    )
  }

  if (template.hero === 'centered') {
    return (
      <header className={cn(glass, 'tilt p-7 text-center md:p-12')} data-tilt>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'split') {
    return (
      <header className={cn(glass, 'tilt p-7 md:p-10')} data-tilt>
        <div className="grid items-start gap-6 md:grid-cols-5 xl:gap-10">
          <div className="md:col-span-3">
            <div data-hero-item>{headline}</div>
            <div data-hero-item className="mt-3">
              {tagline}
            </div>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2">
            {pills}
            <div data-hero-item>{about}</div>
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'stacked') {
    return (
      <header className={cn(glass, 'tilt p-7 md:p-10')} data-tilt>
        <div className="grid gap-6 xl:grid-cols-2 xl:items-end">
          <div className="flex flex-col gap-4">
            {pills}
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
          </div>
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  // editorial — no glass panel at all; the type is the design.
  return (
    <header className="border-b border-[var(--nq-border)] pb-8">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] xl:items-end xl:gap-12">
        <div className="flex flex-col gap-4">
          <div data-hero-item>{headline}</div>
          <div data-hero-item className="border-s-2 border-[var(--nq-accent)] ps-4">
            {tagline}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div data-hero-item className="measure leading-[1.9]">
            {about}
          </div>
          {pills}
        </div>
      </div>
    </header>
  )
}

/* ── Project cards ─────────────────────────────────────────────────────────
   Course work IS the work: it is shown first and labelled honestly, never
   hidden behind a "personal projects" hierarchy.
   ────────────────────────────────────────────────────────────────────────── */

function ProjectItem({
  project,
  lang,
  shape,
}: {
  project: Profile['sections']['projects'][number]
  lang: Lang
  shape: Template['card']
}) {
  const kindLabel =
    project.kind === 'course'
      ? t('courseProject', lang)
      : project.kind === 'team'
        ? t('teamProject', lang)
        : t('personalProject', lang)

  const head = (
    <div className="flex flex-wrap items-center gap-2">
      <Txt value={project.title} lang={lang} as="h3" className="text-lg font-bold" />
      <Badge tone={project.kind === 'course' ? 'highlight' : 'quiet'}>{kindLabel}</Badge>
    </div>
  )

  const meta = (
    <div className="text-[var(--nq-muted-foreground)] mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {project.courseName ? <Txt value={project.courseName} lang={lang} /> : null}
      {project.year ? <span>{formatNumber(project.year, lang, { useGrouping: false })}</span> : null}
      {project.tools.length ? (
        <span dir="ltr" className="font-mono text-xs">
          {project.tools.join(' · ')}
        </span>
      ) : null}
    </div>
  )

  const body = (
    <>
      {head}
      <Txt value={project.description} lang={lang} as="p" className="measure mt-2" />
      {meta}
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
          style={{ color: 'var(--nq-accent)' }}
        >
          {lang === 'ar' ? 'شوف المشروع' : 'View project'}
          <ArrowUpRight size={15} className="icon-flip" aria-hidden="true" />
        </a>
      ) : null}
    </>
  )

  if (shape === 'list') {
    return (
      <li>{body}</li>
    )
  }
  if (shape === 'tile') {
    return (
      <li className="glass-subtle glass-hover rounded-[var(--nq-radius-md)] p-5">{body}</li>
    )
  }
  return (
    <li className="rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] p-5">{body}</li>
  )
}

/* ── Link icons ────────────────────────────────────────────────────────────── */

const LINK_ICON: Record<LinkKind, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  email: AtSign,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  behance: Globe,
  x: Twitter,
  instagram: Instagram,
  website: Globe,
  other: Globe,
}

function linkHref(kind: LinkKind, value: string): string {
  if (kind === 'email') return `mailto:${value}`
  if (kind === 'phone') return `tel:${value.replace(/\s/g, '')}`
  return value.startsWith('http') ? value : `https://${value}`
}

/* ── Sections ──────────────────────────────────────────────────────────────── */

type RenderProps = { profile: Profile; template: Template; lang: Lang }

function Section({ which, profile, template, lang }: RenderProps & { which: SectionKey }) {
  const s = profile.sections
  const glass = template.glass

  switch (which) {
    case 'projects':
      return (
        <SectionShell title={t('projects', lang)} glass={glass} wide>
          <ul className={template.card === 'list' ? 'auto-cols-lg' : 'auto-cols'}>
            {s.projects.map((p) => (
              <ProjectItem key={p.id} project={p} lang={lang} shape={template.card} />
            ))}
          </ul>
        </SectionShell>
      )

    case 'volunteering':
      // Leadership and teaching, not a footnote.
      return (
        <SectionShell title={t('volunteering', lang)} glass={glass}>
          <ul className="auto-cols-lg">
            {s.volunteering.map((v) => (
              <li key={v.id}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Txt value={v.role} lang={lang} as="h3" className="text-lg font-bold" />
                  <span className="text-[var(--nq-muted-foreground)]">—</span>
                  <Txt value={v.organization} lang={lang} className="text-[var(--nq-muted-foreground)]" />
                </div>
                <Txt value={v.impact} lang={lang} as="p" className="measure mt-2" />
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'activities':
      return (
        <SectionShell title={t('activities', lang)} glass={glass}>
          <ul className="auto-cols">
            {s.activities.map((a) => (
              <li key={a.id}>
                <Txt value={a.title} lang={lang} as="h3" className="font-bold" />
                <Txt
                  value={a.detail}
                  lang={lang}
                  as="p"
                  className="text-[var(--nq-muted-foreground)]"
                />
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'experience':
      return (
        <SectionShell title={t('experience', lang)} glass={glass}>
          <ul className="auto-cols-lg">
            {s.experience.map((e) => (
              <li key={e.id}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Txt value={e.role} lang={lang} as="h3" className="text-lg font-bold" />
                  <span className="text-[var(--nq-muted-foreground)]">—</span>
                  <Txt value={e.employer} lang={lang} className="text-[var(--nq-muted-foreground)]" />
                </div>
                <Txt value={e.summary} lang={lang} as="p" className="measure mt-2" />
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'education': {
      const e = s.education!
      return (
        <SectionShell title={t('education', lang)} glass={glass}>
          <div className="space-y-1">
            <Txt value={e.university} lang={lang} as="p" className="text-lg font-bold" />
            <Txt value={e.major} lang={lang} as="p" />
            <p className="text-[var(--nq-muted-foreground)] flex flex-wrap gap-x-4">
              {typeof e.gpa === 'number' ? (
                <span>
                  {lang === 'ar' ? 'المعدّل ' : 'GPA '}
                  {formatGpa(e.gpa, lang)} / {formatNumber(e.gpaScale, lang)}
                </span>
              ) : null}
              {e.expectedGraduation ? (
                <span>
                  {lang === 'ar' ? 'التخرّج المتوقّع ' : 'Expected '}
                  {formatNumber(e.expectedGraduation, lang, { useGrouping: false })}
                </span>
              ) : null}
            </p>
          </div>
        </SectionShell>
      )
    }

    case 'skills':
      return (
        <SectionShell title={t('skills', lang)} glass={glass}>
          <ul className="flex flex-wrap gap-2">
            {s.skills.map((sk) => (
              <li key={sk.id}>
                <Pill>{resolveField(sk.name, lang)?.text}</Pill>
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'links':
      return (
        <SectionShell title={t('links', lang)} glass={glass}>
          <ul className="flex flex-wrap gap-3">
            {s.links.map((l) => {
              const Icon = LINK_ICON[l.kind]
              return (
                <li key={l.id}>
                  <a
                    href={linkHref(l.kind, l.value)}
                    target={l.kind === 'email' || l.kind === 'phone' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] px-3 text-sm transition-colors duration-200 hover:border-[var(--nq-border-strong)]"
                  >
                    <Icon size={17} aria-hidden={true} />
                    <span dir="ltr">{l.value.replace(/^https?:\/\//, '')}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </SectionShell>
      )
  }
}

function MediaTile({ template }: { template: Template }) {
  if (!template.media?.card) return null
  return (
    <section data-reveal>
      <div className={cn(GLASS[template.glass], 'tilt h-full overflow-hidden')} data-tilt>
        <LottieMark
          src={template.media.card}
          className="aspect-[4/3] w-full"
          poster={<span className="block h-full w-full" />}
        />
      </div>
    </section>
  )
}

/* ── The renderer ──────────────────────────────────────────────────────────── */

export function TemplateRenderer({
  profile,
  template,
  lang,
  preview = false,
}: RenderProps & { preview?: boolean }) {
  const scope = useRef<HTMLDivElement>(null)
  useTilt(scope)

  // The single gate: only sections that actually have content, in template
  // order. Nothing downstream can render an empty section.
  const sections = visibleSections(profile, template.order)

  return (
    <div
      ref={scope}
      className="tpl"
      data-template={template.id}
      data-motion-sig={template.motion}
      data-preview={preview ? 'true' : undefined}
    >
      <Background template={template} />
      <RevealObserver scope={scope} />

      {template.media?.corner ? (
        <LottieMark
          src={template.media.corner}
          className="pointer-events-none absolute z-10"
          style={{
            inlineSize: 'clamp(6rem, 12vw, 11rem)',
            aspectRatio: '1',
            insetBlockStart: 0,
            insetInlineEnd: 0,
          }}
        />
      ) : null}

      {/* Full-screen width. Line length is protected inside each section by
          `auto-cols` and `measure`, not by squeezing the page into a column. */}
      <div className="tpl-content container-wide py-10 md:py-16">
        <Hero profile={profile} template={template} lang={lang} />

        {/* Bento: the sections sit beside each other rather than in one column.
            Empty sections are still dropped upstream, and `grid-auto-flow: dense`
            closes the gap they would otherwise leave. */}
        <div
          className={cn(
            'mt-6 md:mt-8',
            template.layout === 'bento' ? 'bento' : 'space-y-6 md:space-y-8'
          )}
        >
          {sections.map((key, i) => (
            <Fragment key={key}>
              <Section which={key} profile={profile} template={template} lang={lang} />
              {/* The art tile sits after the first section rather than last.
                  At the end it stranded alone in a row with two empty columns,
                  and decoration should not be the final thing on a CV anyway. */}
              {i === 0 && template.media?.card ? <MediaTile template={template} /> : null}
            </Fragment>
          ))}
        </div>

        <footer className="text-[var(--nq-muted-foreground)] mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--nq-border)] pt-6 text-sm">
          <a
            href={`/report?handle=${encodeURIComponent(profile.handle)}`}
            className="min-h-11 underline underline-offset-4"
          >
            {t('report', lang)}
          </a>
          {profile.plan === 'free' ? (
            <a href="/" className="min-h-11 underline underline-offset-4">
              {t('builtWith', lang)}
            </a>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
