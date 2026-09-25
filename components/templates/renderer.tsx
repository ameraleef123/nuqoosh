'use client'

import { useEffect, useRef } from 'react'
import {
  ArrowUpRight,
  AtSign,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'
import type { Profile, LinkKind } from '@/lib/schema'
import { SECTION_ORDERS, visibleSections, type SectionKey } from '@/lib/profile'
import { formatGpa, formatNumber, formatRange, resolveField, t, type Lang } from '@/lib/i18n'
import type { Template } from '@/lib/templates'
import { cn } from '@/lib/cn'
import { LottieMark } from '@/components/lottie-mark'
import { RetroGrid } from './retro-grid'
import { DawnSun } from './dawn-sun'
import { InkBlot } from './ink-blot'
import { DeepWater } from './deep-water'
import { Storm } from './storm'
import { TeslaCoil } from './tesla-coil'
import { PetalFall } from './petal-fall'
import { LatticePanel, LatticeWall, Rosette } from './mashrabiya'
import { TowerFacade } from './tower'
import { CitySkyline } from './skyline'
import { ArtMarks, ArtMarkAt } from './arts'
import { MeetingTable } from './boardroom'
import { PaperOrnament } from './paper-ornament'

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
  // A covering scene paints over everything in this layer, so the sun, the
  // grid and the orbs would animate forever without a pixel reaching the
  // screen. Keep only the flat ground colour as the poster under the scene.
  if (template.media?.backgroundFit === 'cover') {
    return (
      <div className="tpl-bg" data-bg={template.background} aria-hidden="true">
        {template.background === 'dawn' ? <span className="tpl-sky" /> : null}
      </div>
    )
  }
  // Paper has no orbs at all: the ground colour plus a static grain, drawn by
  // CSS on this layer. Nothing here ever animates — paper does not move.
  if (template.background === 'paper') {
    return <div className="tpl-bg" data-bg="paper" aria-hidden="true" />
  }
  return (
    <div className="tpl-bg" data-bg={template.background} aria-hidden="true">
      {template.background === 'dawn' ? <span className="tpl-sky" /> : null}

      {/* Signature layers, one per background system. Orbs come after so they
          sit on top of the field or the floor. */}
      {template.background === 'prism' ? <span className="prism-field" /> : null}
      {template.background === 'dawn' ? (
        <>
          <DawnSun />
          <RetroGrid />
        </>
      ) : null}
      {template.background === 'ink' ? <InkBlot /> : null}
      {template.background === 'deep' ? <DeepWater /> : null}
      {template.background === 'volt' ? <Storm /> : null}
      {template.background === 'bloom' ? <PetalFall /> : null}
      {template.background === 'lattice' ? <LatticeWall /> : null}
      {/* فن: the gallery wall. A pool of light from the ceiling and the rail
          the works hang from — both painted once, neither animated. */}
      {template.background === 'gallery' ? (
        <div className="gallery-wall" aria-hidden="true">
          {/* The same painting twice: once blown up and blurred so her own
              landscape fills the page, and once at its true proportions in the
              middle. The wall of this gallery is the picture's own background. */}
          <span className="wall-fill" />
          <span className="wall-art" />
          <span className="wall-light" />
          <span className="wall-rail" />
        </div>
      ) : null}
      {template.background === 'city' ? <CitySkyline /> : null}
      {/* نسيم: three clouds and nothing else. Plain spans — the shape is a
          radial gradient and only `transform` animates, so the whole backdrop
          is compositor work and costs the main thread nothing. */}
      {template.background === 'breeze' ? (
        <>
          <span className="cloud" data-cloud="1" />
          <span className="cloud" data-cloud="2" />
          <span className="cloud" data-cloud="3" />
        </>
      ) : null}

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

/** A CV date range, rendered as the student wrote it, localised where it can be. */
function DateRange({ from, to, lang }: { from?: string; to?: string; lang: Lang }) {
  const text = formatRange(from, to, lang)
  if (!text) return null
  return (
    <p className="text-[var(--nq-muted-foreground)] mt-0.5 text-sm tabular-nums">
      <time>{text}</time>
    </p>
  )
}

const SKILL_GROUPS = ['technical', 'language', 'soft'] as const

/**
 * Skills as pills. When a CV sorted them into groups (technical / languages /
 * soft) the groups are kept, each under a small label; a single group has no
 * label at all.
 */
function SkillGroups({ skills, lang }: { skills: Profile['sections']['skills']; lang: Lang }) {
  const groups = SKILL_GROUPS.map((g) => ({ g, items: skills.filter((sk) => sk.group === g) })).filter(
    (x) => x.items.length
  )
  const labelled = groups.length > 1
  return (
    <div className="space-y-4">
      {groups.map(({ g, items }) => (
        <div key={g}>
          {labelled ? (
            <p className="text-[var(--nq-muted-foreground)] mb-2 text-xs font-semibold tracking-wide">
              {t(g, lang)}
            </p>
          ) : null}
          <ul className="flex flex-wrap gap-2">
            {items.map((sk) => (
              <li key={sk.id}>
                <Pill>{resolveField(sk.name, lang)?.text}</Pill>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  // `data-pill` is the hook a template uses to restyle these without the
  // renderer knowing which template is asking — ورقة squares them off into
  // printed chips, for instance.
  return (
    <span
      data-pill
      className="inline-flex items-center rounded-full border border-[var(--nq-border)] px-2.5 py-0.5 text-sm"
    >
      {children}
    </span>
  )
}

function Badge({ children, tone = 'highlight' }: { children: React.ReactNode; tone?: 'highlight' | 'quiet' }) {
  return (
    <span
      data-badge
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
  span = 1,
  art,
  artSide = 'start',
  stacked = false,
}: {
  title: string
  glass: string
  children: React.ReactNode
  /** Bento column span, chosen from the section's data volume. */
  span?: 1 | 2 | 3
  /** Optional illustration. */
  art?: React.ReactNode
  /** 'start' = under the heading; 'end' = its own column on the far side. */
  artSide?: 'start' | 'end'
  /** Heading above the content instead of beside it. */
  stacked?: boolean
}) {
  // A bento tile is roughly a third of the page, and giving a heading its own
  // column inside one leaves the content about 250px wide: «الجامعة الأردنية»
  // broke over two lines and the skill pills stacked one per row. In a tile
  // the heading goes on top, with the art tucked into the space beside it.
  if (stacked) {
    return (
      <section data-reveal className={span > 1 ? `span-${span}` : undefined}>
        <div className={cn(GLASS[glass as Template['glass']], 'tilt h-full p-6 md:p-8')} data-tilt>
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="heading-rule text-2xl">{title}</h2>
            {art ? <div className="w-16 shrink-0 md:w-20">{art}</div> : null}
          </div>
          {children}
        </div>
      </section>
    )
  }

  // The reveal animates the outer element and the tilt animates the inner one.
  // Sharing a node would mean two rules writing `transform`, and the reveal's
  // `transform: none` end state would cancel the tilt.
  return (
    <section data-reveal className={span > 1 ? `span-${span}` : undefined}>
      <div className={cn(GLASS[glass as Template['glass']], 'tilt h-full p-6 md:p-8')} data-tilt>
        {/* At full width a stacked heading leaves short sections — education,
            skills, contact — hugging one edge with a field of empty space
            beside them. Giving the heading its own column fills the card and
            reads as a label/value pair, which is what these sections are. */}
        <div
          className={cn(
            'section-grid grid gap-5 lg:gap-10',
            artSide === 'end' && art
              ? 'lg:grid-cols-[minmax(8rem,14%)_1fr_auto] lg:items-center'
              : 'lg:grid-cols-[minmax(9rem,16%)_1fr]'
          )}
          // A stable hook so a template can retune the heading column without
          // the renderer knowing which one is asking.
          data-art-side={art ? artSide : undefined}
        >
          <div>
            <h2 className="heading-rule text-2xl">{title}</h2>
            {artSide === 'start' ? art : null}
          </div>
          <div>{children}</div>
          {artSide === 'end' && art ? <div className="justify-self-end">{art}</div> : null}
        </div>
      </div>
    </section>
  )
}

const PROJECTS_ART = '/lottie/projects.lottie'
const EDUCATION_ART = '/lottie/education.lottie'
const SKILLS_ART = '/lottie/skills.lottie'
const CONTACT_ART = '/lottie/contact.lottie'

/* ── Avatar ────────────────────────────────────────────────────────────────
   Most students will not upload a photo, so the fallback is the design, not an
   error state: their initials on the template's accent. Nothing here ever
   renders an empty circle or a placeholder silhouette.
   ────────────────────────────────────────────────────────────────────────── */

function initialsOf(name: string): string {
  // Two things Arabic needs that a naive first-letter-of-each-word does not do.
  //
  // Strip the definite article: the first letter of «الشوابكة» is the alif of
  // «ال», which carries no identity. Without this, «ليان الشوابكة» initialled
  // to «لا» — which is also the Arabic word for "no".
  //
  // Then join with a zero-width non-joiner: Arabic letters connect, so «ل» and
  // «ش» set next to each other fuse into a shape that reads as a different
  // word. U+200C keeps them as two separate initials.
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => Array.from(w.replace(/^ال(?=.)/, ''))[0])
    .filter(Boolean)
    .join('‌')
}

function Avatar({ profile, lang }: { profile: Profile; lang: Lang }) {
  const name = resolveField(profile.fields.fullName, lang)?.text ?? ''
  const initials = initialsOf(name)

  return (
    <div
      data-hero-item
      data-avatar
      // glass-strong, not subtle: on the فجر cover the circle overlaps a peach
      // band and the accent initials measured 4.31:1 on subtle glass — a fail.
      // `data-avatar` lets a template recast the circle entirely — ورقة turns
      // it into an embossed seal.
      className="glass-strong flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full md:size-32"
    >
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- a student photo
        // is an arbitrary remote URL; next/image would need every host allowed.
        <img
          src={profile.avatar}
          alt={name}
          width={128}
          height={128}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-3xl font-extrabold md:text-4xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--nq-accent)' }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}

/* ── How wide a section tile should be ─────────────────────────────────────
   Driven by how much the student actually wrote, not by which section it is.
   A profile with one project should not get a tile twice the width of the same
   tile on a profile with six.
   ────────────────────────────────────────────────────────────────────────── */

function sectionSpan(key: SectionKey, profile: Profile): 1 | 2 | 3 {
  const s = profile.sections
  switch (key) {
    case 'projects':
      return s.projects.length >= 4 ? 3 : s.projects.length >= 2 ? 2 : 1
    case 'experience':
      return s.experience.length >= 2 ? 2 : 1
    case 'volunteering':
      return s.volunteering.length >= 2 ? 2 : 1
    case 'activities':
      return s.activities.length >= 3 ? 2 : 1
    case 'skills':
      return s.skills.length >= 8 ? 2 : 1
    case 'links':
      return s.links.length >= 5 ? 2 : 1
    default:
      return 1
  }
}

/* ── Hero variants ─────────────────────────────────────────────────────────── */

function Hero({ profile, template, lang }: RenderProps) {
  const name = resolveField(profile.fields.fullName, lang)
  const edu = profile.sections.education
  const glass = GLASS[template.glass]

  // Word-level split: Arabic is cursive, so a character split breaks the
  // joining forms and the word stops being readable.
  const words = (name?.text ?? '').split(/\s+/).filter(Boolean)

  const centered = template.hero === 'centered'

  const pills = (
    <div className={cn('flex flex-wrap gap-2', centered && 'justify-center')} data-hero-item>
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

  const location = resolveField(profile.fields.location, lang)
  const tagline = (
    <>
      <Txt
        value={profile.fields.tagline}
        lang={lang}
        as="p"
        className="text-[var(--nq-muted-foreground)] text-lg"
      />
      {location ? (
        <p
          className={cn(
            'text-[var(--nq-muted-foreground)] mt-1 flex items-center gap-1.5 text-sm',
            centered && 'justify-center'
          )}
          lang={location.lang}
          dir={location.lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <MapPin aria-hidden className="size-4 shrink-0" />
          {location.text}
        </p>
      ) : null}
    </>
  )

  const about = (
    <Txt value={profile.fields.about} lang={lang} as="p" className={cn('measure', centered && 'mx-auto')} />
  )

  if (template.hero === 'feature') {
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt overflow-hidden p-7 md:p-10 lg:p-12')} data-tilt>
        <div className="grid items-center gap-7 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-10">
          <Avatar profile={profile} lang={lang} />

          <div className="flex flex-col gap-4">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>

          {/* The art lives in the card. It is hidden below lg rather than
              stacked: on a phone the card is the student's name, not scenery,
              and a display:none LottieMark is never fetched or started. */}
          {art ? (
            <LottieMark src={art} className="hidden size-64 shrink-0 lg:block xl:size-72" />
          ) : null}
        </div>
      </header>
    )
  }

  if (template.hero === 'cover') {
    const art = template.media?.hero
    // Cover-and-avatar: a wide dawn strip across the top of the card, the
    // avatar sitting on its lower edge, the text below. Nothing else on the
    // site uses this shape, which is the point — فجر should be recognisable
    // from across the room.
    return (
      <header className={cn(glass, 'tilt overflow-hidden')} data-tilt>
        {/* No CSS sun in the band: the line-art already carries its own, and
            the page sun still rises behind the whole card. */}
        {/* The strip is see-through: the page scene shows through the glass,
            and the flock crosses it. Birds are silhouettes, so they are
            inverted to white in dark mode (cover-art CSS). */}
        <div className="cover-band" aria-hidden="true">
          {art ? <LottieMark src={art} className="cover-art" fit="cover" /> : null}
        </div>
        <div className="relative px-7 pb-8 md:px-10 md:pb-10">
          {/* The avatar overlaps the band by half its height. */}
          <div className="-mt-14 md:-mt-16">
            <Avatar profile={profile} lang={lang} />
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'centered') {
    // A page torn out of a notebook. Every element is a real thing such a page
    // has, and together they are the template's identity — ورقة spends its
    // budget on paper craft rather than on colour:
    //
    //   · faint blue rules across the sheet, and a terracotta margin down the
    //     start edge, exactly where a school notebook prints one
    //   · the avatar recast as a seal pressed into the sheet (effects.css)
    //   · a carved rosette between two fading hairlines. Arabic letters join,
    //     so a drop cap is impossible; the ornament carries that weight
    //   · one full-bleed hairline where the letterhead ends and the letter
    //     begins, so the paragraph below reads as the body of a letter
    //   · a sheet of paper folding itself into a crane, sketched in the far
    //     margin — the hero mark, and the only moving thing on the sheet
    //   · the corner folded over all of it, and a real shadow under the whole
    //     page so it lifts off the desk
    const art = template.media?.hero
    return (
      <header
        className={cn(glass, 'tilt paper-sheet relative overflow-hidden px-6 py-10 text-center md:px-14 md:py-16')}
        data-tilt
      >
        <span className="paper-margin" aria-hidden="true" />
        {/* display:none below xl, and a display:none LottieMark is never
            fetched or started — a phone renders the page, not the scenery. */}
        {art ? <LottieMark src={art} className="paper-crane" /> : null}

        <div className="relative z-[1] flex flex-col items-center gap-4">
          <Avatar profile={profile} lang={lang} />
          <div data-hero-item>{headline}</div>
          <PaperOrnament />
          <div data-hero-item className="paper-lede">{tagline}</div>
          {pills}
          <span className="paper-divide -mx-6 md:-mx-14" aria-hidden="true" />
          <div data-hero-item className="paper-lede">
            {about}
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'split') {
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt relative p-7 md:p-10')} data-tilt>
        {/* Shine ring: a rotating conic gradient seen only through a 1.5px
            border mask. Rotation is transform-only. */}
        <span className="shine-ring" aria-hidden="true">
          <span className="shine-spin" />
        </span>
        <div className="grid items-center gap-6 md:grid-cols-5 xl:gap-10">
          <div className="md:col-span-3">
            <div data-hero-item>{headline}</div>
            <div data-hero-item className="mt-3">
              {tagline}
            </div>
            <div data-hero-item className="mt-4">
              {about}
            </div>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2">
            {art ? (
              <LottieMark
                src={art}
                className="mx-auto hidden aspect-square w-full max-w-64 md:block"
              />
            ) : null}
            {pills}
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'table') {
    // The meeting, seen from above. The portrait takes the head seat; the
    // others belong to whoever is being met. The table is drawn because every
    // meeting illustration in the catalogue already has people in it, and a
    // portrait placed beside those people is a fifth stranger.
    const deal = template.media?.hero
    return (
      <header className={cn(glass, 'tilt table-hero')} data-tilt>
        <div className="table-stage">
          <MeetingTable />
          {deal ? <LottieMark src={deal} className="table-deal" speed={0.6} /> : null}
          <div className="table-head">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>

        <div className="table-body">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'frame') {
    // A gallery, and the person is the first work hung in it. The portrait is
    // mounted and framed with a museum label under it; the other works on the
    // wall are where the colour lives.
    const work = template.media?.hero
    return (
      <header className={cn(glass, 'tilt frame-hero')} data-tilt>
        <div className="hang">
          <div className="hang-wire" aria-hidden="true" />
          <figure className="framed" data-piece="portrait">
            <div className="framed-mount">
              <Avatar profile={profile} lang={lang} />
            </div>
          </figure>
          {/* The museum label. A caption gives a work its name, its medium and
              its year — which is what the top of a CV is. */}
          <figcaption className="plaque">
            <span className="plaque-rule" aria-hidden="true" />
            {headline}
            {tagline}
          </figcaption>
        </div>

        <div className="frame-body">
          {pills}
          <div data-hero-item>{about}</div>
          <ArtMarks />
        </div>

        {/* Two more works on the same wall, hung off the eye line. */}
        {work ? (
          <>
            <LottieMark src={work} className="framed-work" data-work="1" speed={0.4} />
            <LottieMark src={work} className="framed-work" data-work="2" speed={0.28} />
          </>
        ) : null}
      </header>
    )
  }

  if (template.hero === 'pin') {
    // The world, and the person as a pin stuck in it. The map fills the card,
    // the marker is planted on it with the portrait in its head, and the ring
    // is still going out from where it landed.
    const globe = template.media?.heroCorner
    return (
      <header className={cn(glass, 'tilt pin-hero')} data-tilt>
        {/* No map in here: the world is the page behind this card, and the
            cards are thin enough to show it. */}
        {globe ? <LottieMark src={globe} className="pin-globe" speed={0.25} /> : null}

        <div className="pin-mark">
          <div className="pin-ping" aria-hidden="true" />
          <div className="pin-head">
            <Avatar profile={profile} lang={lang} />
          </div>
          <span className="pin-point" aria-hidden="true" />
        </div>

        <div className="pin-body">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'window') {
    // A tower at night, and the portrait is one lit window in it.
    //
    // The writing sits BESIDE the portrait, not above it, and the card is
    // short: an earlier version reserved a tall band of city across the foot
    // of the hero with the text stacked above it, which made the card enormous
    // and pushed everything else off the screen. The city belongs to the page
    // now, behind everything, where it can run the full width without any
    // layout having to make room for it.
    const art = template.media?.hero
    const burst = template.media?.heroCorner
    return (
      <header className={cn(glass, 'tilt window-hero')} data-tilt>
        {/* The cityscape the tower stands in. Absolutely positioned along the
            foot of the card, so it adds a city without adding height — the
            last version put a tall band of it in the flow and the hero came
            out nearly twice as tall as it needed to be. */}
        {art ? <LottieMark src={art} className="window-cityline" /> : null}

        {/* The far corner is the one the layout never uses, and an empty corner
            in a night scene reads as an unfinished card rather than as air. */}
        {burst ? (
          <LottieMark
            src={burst}
            className="window-burst"
            speed={0.5}
            segment={template.media?.heroCornerSegment}
          />
        ) : null}

        <div className="window-tower">
          <TowerFacade />
          <div className="window-mine">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>

        <div className="window-body">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'screen') {
    // The portrait sits in an opening cut THROUGH the screen — the lattice
    // runs behind and around it, and a turned ring closes the edge so it reads
    // as a hole in the woodwork rather than a photo pasted on a pattern.
    return (
      <header className={cn(glass, 'tilt screen-hero')} data-tilt>
        {/* The شمسة hangs in the empty corner, away from the window — carved
            into the wall of the room rather than hung inside the screen. */}
        <Rosette />

        <div className="screen-window">
          <LatticePanel />
          <div className="screen-opening">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>

        <div className="screen-body">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'kite') {
    // A kite is the one thing that makes a breeze visible, and it comes with a
    // string — so the page gets the relationship سِيق and مُحيط are built on:
    // the art is not beside the person, it is ATTACHED to them. The kites fly
    // in the far corner, the string runs down across the card, and the
    // portrait sits at the bottom of it holding on.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt kite-hero')} data-tilt>
        {art ? <LottieMark src={art} className="kite-flight" /> : null}

        {/* The string. Stretched to the card with preserveAspectRatio="none",
            so its two ends stay pinned to the corners at every width instead
            of drifting away from the kite as the card grows. */}
        <svg
          className="kite-string"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M14 86 C 38 78, 52 56, 66 34 C 72 24, 78 16, 86 10" />
        </svg>

        <div className="kite-body">
          <div className="kite-text">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>

          {/* The portrait comes LAST, at the foot of the card, because that is
              where the string ends. A kite is high and the person holding it
              is low; putting the portrait at the top broke the one
              relationship this hero exists to show. */}
          <div className="kite-holder">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'hanging') {
    // Mostly empty on purpose. Sakura is a composition before it is a colour:
    // asymmetry, a lot of air, and one branch off to a corner. The content is
    // pushed to the lower start of the card and the blossoms hang above it.
    //
    // The same 1.5 KB blossom is drawn three times at three sizes rather than
    // fetching a branch, which the free catalogue does not have.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt hanging-hero')} data-tilt>
        {art ? (
          // One branch, entering from the top corner and reaching across the
          // empty half of the card. It is a real cherry branch — brown wood,
          // five-petal blossoms, a few leaves — so nothing here recolours it.
          //
          // Two elements, not one, and that is a performance fix rather than a
          // structural preference: the fade lives on the wrapper and the mirror
          // on the art. Putting a mask and a transform on the SAME element that
          // holds a canvas repainting every frame forces the whole region to be
          // re-rastered on the CPU each frame — measured at 2300ms of main
          // thread per 5s of scrolling, against 1190ms with them split.
          <div className="hanging-branch" aria-hidden="true">
            <LottieMark src={art} className="hanging-branch-art" speed={0.7} />
          </div>
        ) : null}

        <div className="hanging-body">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar profile={profile} lang={lang} />
            <div data-hero-item className="min-w-0 flex-1">
              {headline}
            </div>
          </div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'mast') {
    // مَدى means range — how far a signal actually gets. The first version of
    // this hero said that with a dotted reticle, which is a diagram and not a
    // place. This is the structure: a mast with its lamp lit, the portrait
    // standing at the foot of it, and the range opening out across the card.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt mast-hero')} data-tilt>
        <div className="mast-tower">
          {art ? <LottieMark src={art} className="mast-art" /> : null}

          {/* The range. Three rings opening from the lamp and dying out at the
              far edge — scale and opacity only, so the compositor runs them
              and the main thread never sees a frame. */}
          <div className="mast-range" aria-hidden="true">
            <span data-ring="1" />
            <span data-ring="2" />
            <span data-ring="3" />
          </div>

          <div className="mast-foot">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>

        <div className="mast-main">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'coil') {
    // The machine this template is named after, on the page. The first version
    // was a "spark gap" — two separate plates with an arc between them — which
    // was a neat diagram of Tesla's idea and read as a layout that had come
    // apart. A coil is one object, and the portrait stands at the foot of it.
    return (
      <header className={cn(glass, 'tilt coil-hero')} data-tilt>
        <div className="coil-stage">
          <TeslaCoil />
          <div className="coil-base">
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>

        <div className="coil-body">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'breakout') {
    // The art hangs ABOVE the card, over its top edge, which is the one thing
    // no other hero here does — every other template keeps its art inside the
    // frame. A card that cannot hold its own contents is the whole idea.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt breakout-hero')} data-tilt>
        {art ? <LottieMark src={art} className="breakout-art" /> : null}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar profile={profile} lang={lang} />
            <div data-hero-item className="min-w-0 flex-1">
              {headline}
            </div>
          </div>
          <div data-hero-item>{tagline}</div>
          {pills}
          <div data-hero-item>{about}</div>
        </div>
      </header>
    )
  }

  if (template.hero === 'sunlit') {
    // One card, two halves: the lit one carries who they are, the shaded one
    // carries what they say, and the edge between them is the only hard line
    // on the page. The frond sits in the shade and throws a real drop-shadow
    // of its own silhouette, which is where the template's name comes from.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt sunlit-hero')} data-tilt>
        <div className="sunlit-lit">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar profile={profile} lang={lang} />
            <div data-hero-item className="min-w-0 flex-1">
              {headline}
            </div>
          </div>
          <div data-hero-item>{tagline}</div>
          {pills}
        </div>
        <div className="sunlit-shade">
          {/* Behind the paragraph on purpose: the sentence is read THROUGH the
              shadow, which is the whole picture. What makes that legible is
              the shadow's strength, not its position — see the opacity note in
              effects.css. */}
          {art ? <LottieMark src={art} className="sunlit-frond" /> : null}
          <div data-hero-item className="relative">
            {about}
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'porthole') {
    // A window onto the deep, with the glass between you and it: a thick rim,
    // eight rivets, a curved highlight across the pane, and one creature
    // drifting behind it. Nothing else in the set frames its art as something
    // you are looking THROUGH.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt p-7 md:p-10 lg:p-12')} data-tilt>
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar profile={profile} lang={lang} />
              <div data-hero-item className="min-w-0 flex-1">
                {headline}
              </div>
            </div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>
          <div className="porthole">
            <div className="porthole-glass">
              {art ? <LottieMark src={art} className="porthole-art" /> : null}
            </div>
            <span className="porthole-shine" aria-hidden="true" />
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'blocks') {
    // The hero IS a composition: five cells in a grid, separated by the rules
    // that a 1px gap over a ruled background draws for free. No other hero in
    // the set is built out of cells; the rest are all text beside a picture.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt blocks-hero')} data-tilt>
        <div className="blocks-cell blocks-name">
          <div data-hero-item>{headline}</div>
          <div data-hero-item className="mt-3">
            {tagline}
          </div>
        </div>
        <div className="blocks-cell blocks-art">
          {art ? <LottieMark src={art} className="blocks-art-inner" /> : null}
        </div>
        <div className="blocks-cell blocks-about" data-hero-item>
          {about}
        </div>
        <div className="blocks-cell blocks-pills">{pills}</div>
        <div className="blocks-cell blocks-face">
          <Avatar profile={profile} lang={lang} />
        </div>
      </header>
    )
  }

  if (template.hero === 'gate') {
    // A niche cut into the card: an arch with the carved gate inside it and
    // the portrait standing in the doorway, overlapping its lower edge. Where
    // ثُرَيّا's orbit puts the student inside a diagram, this puts them inside
    // a piece of architecture.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt p-7 md:p-10 lg:p-12')} data-tilt>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="flex flex-col gap-4">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>
          <div className="gate-frame">
            <div className="gate-niche">
              {art ? <LottieMark src={art} className="gate-art" /> : null}
            </div>
            <div className="gate-figure">
              <Avatar profile={profile} lang={lang} />
            </div>
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'ribbon') {
    // Two registers with one moving line between them: who they are above it,
    // what they carry below. The line runs the full width of the card, past
    // the padding on both sides, so the hero reads as a surface something
    // crossed rather than as a box with a picture in it.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt overflow-hidden px-7 pt-9 pb-8 md:px-12 md:pt-14 md:pb-10')} data-tilt>
        <div className="flex max-w-4xl flex-col gap-4">
          <div data-hero-item>{headline}</div>
          <div data-hero-item>{tagline}</div>
          <div data-hero-item>{about}</div>
        </div>

        <span className="ribbon-stroke -mx-7 md:-mx-12" aria-hidden="true">
          {art ? <LottieMark src={art} className="ribbon-art" fit="cover" speed={0.35} /> : null}
        </span>

        <div className="flex flex-wrap items-center gap-5">
          <Avatar profile={profile} lang={lang} />
          {pills}
        </div>
      </header>
    )
  }

  if (template.hero === 'orbit') {
    // The rings turn around the avatar rather than beside it: the student is
    // the star at the centre of their own chart, and the bright points on the
    // orbits are everything else on the page. Nothing else in the set puts the
    // portrait inside the art.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt relative overflow-hidden p-7 md:p-10 lg:p-12')} data-tilt>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="flex flex-col gap-4">
            <div data-hero-item>{headline}</div>
            <div data-hero-item>{tagline}</div>
            {pills}
            <div data-hero-item>{about}</div>
          </div>
          <div className="orbit-frame">
            {art ? <LottieMark src={art} className="orbit-rings" /> : null}
            <Avatar profile={profile} lang={lang} />
          </div>
        </div>
      </header>
    )
  }

  if (template.hero === 'stacked') {
    // Two columns that read as one sentence: who they are on the start side,
    // what they are about on the end side, with the hero mark between them so
    // the art sits inside the thought rather than beside it.
    const art = template.media?.hero
    return (
      <header className={cn(glass, 'tilt p-7 md:p-10')} data-tilt>
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:items-center xl:gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <Avatar profile={profile} lang={lang} />
              <div data-hero-item className="min-w-0 flex-1">
                {headline}
              </div>
            </div>
            <div data-hero-item>{tagline}</div>
            {pills}
          </div>
          <div className="flex items-center gap-6">
            {/* Hidden below lg rather than stacked: on a phone the card is the
                student's name, and a display:none LottieMark is never fetched. */}
            {art ? <LottieMark src={art} className="hidden size-36 shrink-0 lg:block xl:size-44" /> : null}
            <div data-hero-item className="min-w-0">
              {about}
            </div>
          </div>
        </div>
      </header>
    )
  }

  // editorial — no glass panel at all; the type is the design. The avatar is
  // a byline portrait beside the name, and the art sits on a paper disc in
  // the far column like a magazine spot illustration.
  const editorialArt = template.media?.hero
  return (
    <header className="border-b border-[var(--nq-border)] pb-8">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr] xl:items-center xl:gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar profile={profile} lang={lang} />
            <div data-hero-item className="min-w-0 flex-1">
              {headline}
            </div>
          </div>
          <div data-hero-item className="border-s-2 border-[var(--nq-accent)] ps-4">
            {tagline}
          </div>
          <div data-hero-item className="measure leading-[1.9]">
            {about}
          </div>
          {pills}
        </div>
        {editorialArt ? (
          <div data-hero-item className="ink-paper mx-auto xl:ms-auto xl:me-0">
            {/* The source frame is mostly empty margin around the quill, so the
                art box is oversized and the disc clips it. The canvas renders
                at full resolution and is only cropped, never upscaled. */}
            <LottieMark src={editorialArt} className="ink-paper-art" />
          </div>
        ) : null}
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
  index,
}: {
  project: Profile['sections']['projects'][number]
  lang: Lang
  shape: Template['card']
  /** Position in the list, for the numbered ledger margin. */
  index: number
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
  if (shape === 'brief') {
    // A briefing note: numbered in the margin the way an agenda is, because a
    // list of work shown to a client is an agenda.
    return (
      <li className="brief" data-n={index + 1}>
        {body}
      </li>
    )
  }
  if (shape === 'poster') {
    // A playbill. Each one carries a different craft's mark, so a list of
    // projects reads as a programme rather than as a stack of boxes.
    return (
      <li className="poster">
        <span className="poster-mark" aria-hidden="true">
          <ArtMarkAt index={index} />
        </span>
        {body}
      </li>
    )
  }
  if (shape === 'legend') {
    // An entry in a map legend: a key mark in the margin and the reading
    // beside it, on a plain sheet with a ruled edge.
    return <li className="legend">{body}</li>
  }
  if (shape === 'marquee') {
    // A lit sign: the panel is dark and the light is along its top edge, the
    // way a marquee throws light down over what it is announcing.
    return <li className="marquee">{body}</li>
  }
  if (shape === 'inlay') {
    // A panel of wood with one brass line let into its start edge — inlay, the
    // way a real screen is finished. No border anywhere else.
    return <li className="inlay">{body}</li>
  }
  if (shape === 'slat') {
    // Wide and short, like a slat of a shutter — white paper lying on the sky
    // rather than a panel cut into it. The shadow is what sells the float, so
    // it is the one thing here that is not subtle.
    return <li className="slat">{body}</li>
  }
  if (shape === 'petal') {
    // Three corners rounded and one cut square — a petal, and a shape that has
    // to flip with the language, so the sharp corner is a logical one.
    return <li className="petal-card">{body}</li>
  }
  if (shape === 'live') {
    // A dead wire until the pointer reaches it, and then the whole border
    // goes live.
    return <li className="live-card">{body}</li>
  }
  if (shape === 'ping') {
    // Each entry carries a signal indicator in its margin — a lit node that
    // sends one ring outward when the pointer reaches it.
    return <li className="ping-card">{body}</li>
  }
  if (shape === 'ember') {
    // Lit from below rather than above: a coal, not a stone. The inverse of
    // مُحيط's pebble, and the glow rises when the pointer is on it.
    return <li className="ember-card">{body}</li>
  }
  if (shape === 'cast') {
    // Flat on the wall, throwing one long shadow away from the same sun as
    // everything else on the page.
    return <li className="cast-card">{body}</li>
  }
  if (shape === 'pebble') {
    // Worn smooth and lit from above, the way anything is that has been
    // sitting on a seabed for a while.
    return <li className="pebble-card">{body}</li>
  }
  if (shape === 'block') {
    // A flat rectangle with a bar down its start edge. No radius, no shadow:
    // on this template depth is expressed by the grid, not by lifting things
    // off it.
    return <li className="block-card">{body}</li>
  }
  if (shape === 'carved') {
    // Cut into the stone rather than laid on it: the top inner edge sits in
    // shadow and the bottom one catches the light, which is the exact inverse
    // of a raised panel (effects.css).
    return <li className="carved-card">{body}</li>
  }
  if (shape === 'float') {
    // No panel at all: an entry separated from the next by a hairline and a
    // lot of air, lifting a little when the pointer is on it.
    return <li className="float-card">{body}</li>
  }
  if (shape === 'lume') {
    // A tile lit along its top edge, the way a card catches light from a star
    // above it. The glow itself is a pseudo-element (effects.css).
    return <li className="lume-card glass-subtle rounded-[var(--nq-radius-md)] p-5">{body}</li>
  }
  if (shape === 'branch') {
    // Each project is a bud on a stem that runs down the section. The stem and
    // the bud are both pseudo-elements (effects.css), so the markup stays a
    // plain list item and the screen reader hears nothing decorative.
    return <li className="branch-node">{body}</li>
  }
  if (shape === 'ledger') {
    // A ruled ledger: each project is a row under a hairline, numbered in the
    // margin the way an index is. The number is rendered, not a CSS counter,
    // so it follows the page's numerals (٠١ in Arabic, 01 in English).
    return (
      <li className="ledger-row">
        <span className="ledger-num" aria-hidden="true">
          {formatNumber(index + 1, lang, { useGrouping: false, minimumIntegerDigits: 2 })}
        </span>
        <div className="min-w-0">{body}</div>
      </li>
    )
  }
  if (shape === 'tile') {
    return (
      <li className="glass-subtle glass-hover sweep rounded-[var(--nq-radius-md)] p-5">{body}</li>
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
  const bento = template.layout === 'bento'
  const span = bento ? sectionSpan(which, profile) : 1

  switch (which) {
    case 'projects':
      return (
        <SectionShell
          title={t('projects', lang)}
          glass={glass}
          span={span}
          stacked={bento}
          art={
            // The same team illustration in every template — it lives in the
            // heading column, which sits empty beside the grid at full width.
            // Vector, 17.6 KB, lazy, reduced-motion aware like every LottieMark.
            <LottieMark
              src={PROJECTS_ART}
              data-art="1"
              className="mt-4 aspect-[4/3] w-full max-w-56 lg:max-w-none"
            />
          }
        >
          <ul
            className={
              template.card === 'ledger'
                ? 'ledger'
                : template.card === 'branch'
                  ? 'branch'
                  : template.card === 'float'
                    ? 'floats'
                    : template.card === 'list'
                      ? 'auto-cols-lg'
                      : 'auto-cols'
            }
          >
            {s.projects.map((p, i) => (
              <ProjectItem key={p.id} project={p} lang={lang} shape={template.card} index={i} />
            ))}
          </ul>
        </SectionShell>
      )

    case 'volunteering':
      // Leadership and teaching, not a footnote.
      return (
        <SectionShell title={t('volunteering', lang)} glass={glass} span={span} stacked={bento}>
          <ul className="auto-cols-lg">
            {s.volunteering.map((v) => (
              <li key={v.id}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Txt value={v.role} lang={lang} as="h3" className="text-lg font-bold" />
                  <span className="text-[var(--nq-muted-foreground)]">—</span>
                  <Txt value={v.organization} lang={lang} className="text-[var(--nq-muted-foreground)]" />
                </div>
                <DateRange from={v.from} to={v.to} lang={lang} />
                <Txt value={v.impact} lang={lang} as="p" className="measure mt-2" />
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'activities':
      return (
        <SectionShell title={t('activities', lang)} glass={glass} span={span} stacked={bento}>
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
        <SectionShell title={t('experience', lang)} glass={glass} span={span} stacked={bento}>
          <ul className="auto-cols-lg">
            {s.experience.map((e) => (
              <li key={e.id}>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <Txt value={e.role} lang={lang} as="h3" className="text-lg font-bold" />
                  <span className="text-[var(--nq-muted-foreground)]">—</span>
                  <Txt value={e.employer} lang={lang} className="text-[var(--nq-muted-foreground)]" />
                </div>
                <DateRange from={e.from} to={e.to} lang={lang} />
                <Txt value={e.summary} lang={lang} as="p" className="measure mt-2" />
              </li>
            ))}
          </ul>
        </SectionShell>
      )

    case 'education': {
      const e = s.education!
      return (
        <SectionShell
          title={t('education', lang)}
          glass={glass}
          span={span}
          stacked={bento}
          artSide="end"
          art={
            // A single object rather than a scene, so it is sized smaller than
            // the projects illustration and kept square.
            <LottieMark
              src={EDUCATION_ART}
              data-art="1"
              className="aspect-square w-full max-w-36 lg:max-w-44"
            />
          }
        >
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
                  {/* A year already behind us is a graduation, not an expectation. */}
                  {e.expectedGraduation < new Date().getFullYear()
                    ? lang === 'ar' ? 'تخرّج ' : 'Graduated '
                    : lang === 'ar' ? 'التخرّج المتوقّع ' : 'Expected '}
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
        <SectionShell
          title={t('skills', lang)}
          glass={glass}
          span={span}
          stacked={bento}
          artSide="end"
          art={
            <LottieMark
              src={SKILLS_ART}
              data-art="1"
              className="aspect-square w-full max-w-36 lg:max-w-44"
            />
          }
        >
          <SkillGroups skills={s.skills} lang={lang} />
        </SectionShell>
      )

    case 'links':
      return (
        <SectionShell
          title={t('links', lang)}
          glass={glass}
          span={span}
          stacked={bento}
          artSide="end"
          art={
            <LottieMark
              src={CONTACT_ART}
              data-art="1"
              // Landscape source (950x760): a square box letterboxed it into a
              // thin phone. Sized to its own ratio and a touch wider.
              className="aspect-[5/4] w-full max-w-44 lg:max-w-56"
            />
          }
        >
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
  // Education and contact share a row at the foot of the page — unless the
  // template is study-first (order B), where education is the point and stays
  // at the top at full width. Pairing would have dragged it down to contact.
  const pairable =
    SECTION_ORDERS[template.order][0] !== 'education' &&
    sections.includes('education') &&
    sections.includes('links')

  return (
    <div
      ref={scope}
      className="tpl"
      data-template={template.id}
      data-motion-sig={template.motion}
      // A covering scene reaches the footer, which is the one piece of text
      // with no card under it. Exposing the fit lets one rule protect every
      // template that uses one (effects.css) instead of each finding out.
      data-bg-fit={template.media?.backgroundFit}
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

      {/* The backdrop is fixed to the viewport, not to the page: it keeps
          falling in place while the visitor scrolls, and each tile only ever
          has to cover one screen instead of the whole document. */}
      {template.media?.background ? (
        <div
          className="tpl-screen-art"
          data-fit={template.media.backgroundFit ?? 'tile'}
          aria-hidden="true"
        >
          {template.media.backgroundFit === 'cover' ? (
            // One wide scene covering the viewport — a landscape, not a loop
            // to repeat. Cropped by `cover`, never stretched.
            <LottieMark src={template.media.background} className="tpl-screen-cover" fit="cover" />
          ) : template.media.backgroundFit === 'band' ? (
            // One wide strip along the foot of the viewport: the page grows
            // out of it. Sized by its own aspect ratio in CSS, never stretched.
            <LottieMark src={template.media.background} className="tpl-screen-band" />
          ) : (
            [0, 1, 2].map((i) => (
              <LottieMark
                key={i}
                src={template.media!.background!}
                className={cn('tpl-screen-tile', i > 0 && 'tpl-screen-tile-extra')}
              />
            ))
          )}
        </div>
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
            // `sections` is a stable hook: ورقة opens the gaps up so the desk
            // shows between its sheets.
            'sections mt-6 md:mt-8',
            template.layout === 'bento' ? 'bento' : 'space-y-6 md:space-y-8'
          )}
        >
          {sections.map((key) => {
            // Education and contact share one row, each half the width. The
            // pair is rendered where contact would have been, so education
            // moves down to meet it; if either is missing the other keeps its
            // own place at full width. Bento layouts keep their own packing.
            if (template.layout === 'stack' && pairable) {
              if (key === 'education') return null
              if (key === 'links') {
                return (
                  <div key="education+links" className="grid gap-6 md:gap-8 lg:grid-cols-2">
                    <Section which="education" profile={profile} template={template} lang={lang} />
                    <Section which="links" profile={profile} template={template} lang={lang} />
                  </div>
                )
              }
            }
            return (
              <Section key={key} which={key} profile={profile} template={template} lang={lang} />
            )
          })}
        </div>

        {/* The footer carries the free-plan credit and nothing else. There was
            a «report this page» link here; it pointed at a /report route that
            was never built, and the owner asked for it gone. Reporting still
            exists server-side (POST /api/report) for whatever moderation
            surface replaces it. */}
        {profile.plan === 'free' ? (
          <footer className="text-[var(--nq-muted-foreground)] mt-10 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--nq-border)] pt-6 text-sm">
            <a href="/" className="min-h-11 underline underline-offset-4">
              {t('builtWith', lang)}
            </a>
          </footer>
        ) : null}
      </div>
    </div>
  )
}
