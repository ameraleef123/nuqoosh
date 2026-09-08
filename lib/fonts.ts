import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Amiri,
  Almarai,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
} from 'next/font/google'

/**
 * Arabic is the source language, so the Arabic subset is loaded explicitly and
 * listed first. A Latin fallback must never be allowed to render Arabic —
 * next/font emits per-subset `unicode-range`, which guarantees that.
 *
 * Every family here ships a Latin subset drawn to the same vertical metrics as
 * its Arabic, so a mixed-script line sits on one baseline.
 *
 * Preload policy: only the default pair (Cairo + IBM Plex Sans Arabic) is
 * preloaded. Template-specific families declare `preload: false` and rely on
 * `font-display: swap` — an unused @font-face is never downloaded, so the
 * gallery does not pay for families it is not rendering.
 */

/* ── Default pair ────────────────────────────────────────────────────────── */

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '600', '700', '800'],
})

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-plex-arabic',
  weight: ['400', '500', '600', '700'],
})

/* ── Wordmark ────────────────────────────────────────────────────────────── */

/**
 * TODO(before launch): outline نُقوش to SVG paths and drop this webfont
 * (MASTER.md §2.1). Rendering <text> is correct but ties the mark to a font load.
 */
export const amiri = Amiri({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-amiri',
  weight: ['700'],
  preload: false,
})

/* ── Template families ───────────────────────────────────────────────────── */

export const almarai = Almarai({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-almarai',
  weight: ['300', '400', '700', '800'],
  preload: false,
})

export const notoNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-naskh',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

export const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-arabic',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

export const fontVariables = [
  cairo.variable,
  plexArabic.variable,
  amiri.variable,
  almarai.variable,
  notoNaskh.variable,
  notoSansArabic.variable,
].join(' ')
