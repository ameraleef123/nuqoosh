import type { ReactNode, ElementType, HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/* ── Mesh background ───────────────────────────────────────────────────────
   Layer depth: background mesh → floating orbs → glass cards → content.
   Glass needs something to refract; a flat grey behind glass is failed glass.
   Orbs animate transform only, 24–36s, and pause when the tab is hidden.
   Server component: zero client JS.
   ────────────────────────────────────────────────────────────────────────── */

export function Mesh() {
  return (
    <div className="mesh" aria-hidden="true">
      <div
        className="orb"
        data-orb="1"
        style={{
          background: 'var(--orb-1)',
          inlineSize: '46vmax',
          blockSize: '46vmax',
          insetInlineStart: '-10vmax',
          insetBlockStart: '-12vmax',
          ['--orb-duration' as string]: '32s',
          ['--orb-dx' as string]: '8%',
          ['--orb-dy' as string]: '6%',
        }}
      />
      <div
        className="orb"
        data-orb="2"
        style={{
          background: 'var(--orb-2)',
          inlineSize: '38vmax',
          blockSize: '38vmax',
          insetInlineEnd: '-8vmax',
          insetBlockStart: '10vmax',
          ['--orb-duration' as string]: '28s',
          ['--orb-dx' as string]: '-6%',
          ['--orb-dy' as string]: '10%',
        }}
      />
      <div
        className="orb"
        data-orb="3"
        style={{
          background: 'var(--orb-3)',
          inlineSize: '42vmax',
          blockSize: '42vmax',
          insetInlineStart: '20vmax',
          insetBlockEnd: '-18vmax',
          ['--orb-duration' as string]: '36s',
          ['--orb-dx' as string]: '5%',
          ['--orb-dy' as string]: '-8%',
        }}
      />
      <div
        className="orb"
        data-orb="4"
        style={{
          background: 'var(--orb-4)',
          inlineSize: '30vmax',
          blockSize: '30vmax',
          insetInlineEnd: '12vmax',
          insetBlockEnd: '-6vmax',
          ['--orb-duration' as string]: '30s',
          ['--orb-dx' as string]: '-7%',
          ['--orb-dy' as string]: '-5%',
        }}
      />
    </div>
  )
}

/* ── Glass surface ─────────────────────────────────────────────────────────
   Three intensities, all with a solid-colour @supports fallback (globals.css).
   ────────────────────────────────────────────────────────────────────────── */

type GlassProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  intensity?: 'subtle' | 'default' | 'strong'
  hover?: boolean
  children?: ReactNode
}

export function Glass({
  as: Tag = 'div',
  intensity = 'default',
  hover = false,
  className,
  children,
  ...rest
}: GlassProps) {
  const base =
    intensity === 'subtle' ? 'glass-subtle' : intensity === 'strong' ? 'glass-strong' : 'glass'
  return (
    <Tag className={cn(base, hover && 'glass-hover', className)} {...rest}>
      {children}
    </Tag>
  )
}

/* ── Wordmark ──────────────────────────────────────────────────────────────
   نُقوش in calligraphic Naskh. Arabic-first at first glance: the Latin label is
   secondary and optional. currentColor makes it work in both themes from one
   asset, so there is no light/dark asset to keep in sync.

   TODO(before launch): outline the glyphs to <path> and drop the Amiri webfont
   (MASTER.md §2.1). Rendering <text> is correct but ties the mark to a font load.
   ────────────────────────────────────────────────────────────────────────── */

export function Wordmark({
  className,
  withLatin = false,
  title = 'نُقوش',
}: {
  className?: string
  withLatin?: boolean
  title?: string
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <svg
        viewBox="0 0 160 64"
        role="img"
        aria-label={title}
        className="block h-9 w-auto"
        style={{ color: 'currentColor' }}
      >
        <text
          x="80"
          y="46"
          textAnchor="middle"
          fill="currentColor"
          style={{
            fontFamily: 'var(--font-amiri), serif',
            fontSize: '44px',
            fontWeight: 700,
            direction: 'rtl',
          }}
        >
          نُقوش
        </text>
      </svg>
      {withLatin ? (
        <span
          lang="en"
          dir="ltr"
          className="text-[0.6875rem] uppercase tracking-[0.18em] opacity-60"
        >
          Nuqush
        </span>
      ) : null}
    </span>
  )
}

/* ── Section heading with the logical accent hairline ─────────────────────── */

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <h2 className={cn('heading-rule text-2xl', className)}>{children}</h2>
}

/* ── Reveal wrapper ────────────────────────────────────────────────────────
   Server component. It only stamps `data-reveal`; MotionProvider picks the
   element up and animates it. With JS off or reduced motion, the CSS guard
   never applies, so the content is simply visible.
   ────────────────────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  return (
    <Tag data-reveal className={className}>
      {children}
    </Tag>
  )
}
