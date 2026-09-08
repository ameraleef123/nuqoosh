import { Cairo, IBM_Plex_Sans_Arabic, Amiri } from 'next/font/google'

/**
 * Arabic is the source language, so the Arabic subset is loaded explicitly and
 * listed first. A Latin fallback must never be allowed to render Arabic —
 * next/font emits per-subset `unicode-range`, which guarantees that.
 *
 * Both families ship a Latin subset drawn to the same vertical metrics as their
 * Arabic, so a mixed-script line sits on one baseline.
 */

/** Display / headings — variable (wght 200–1000), one file. */
export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['400', '600', '700', '800'],
})

/** Body — its Latin *is* IBM Plex Sans, the strongest mixed-script match. */
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-plex-arabic',
  weight: ['400', '500', '600', '700'],
})

/**
 * Wordmark only — calligraphic Naskh, one weight, Arabic subset only.
 * TODO(before launch): outline نُقوش to SVG paths and drop this webfont, per
 * design-system/nuqush/MASTER.md §2.1. Loading it costs ~12 KB today.
 */
export const amiri = Amiri({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-amiri',
  weight: ['700'],
})

export const fontVariables = [cairo.variable, plexArabic.variable, amiri.variable].join(' ')
