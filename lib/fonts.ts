/**
 * Fonts are local files. See app/fonts.css for the @font-face rules and
 * public/fonts/ for the woff2 files — nothing is fetched from Google at build
 * or run time.
 *
 * `next/font/google` used to live here. It self-hosts at run time but still
 * downloads from Google every build, which made the build depend on the
 * network and on a third party. The CSS variables it used to inject
 * (--font-cairo and friends) are now declared in fonts.css on :root.
 *
 * Preload only the default pair's Arabic files: they are on the first paint
 * of every page. Template-specific families load on demand via font-display:
 * swap and are never downloaded unless their template is rendered.
 */
export const PRELOAD_FONTS = [
  '/fonts/cairo/arabic-400-800.woff2',
  '/fonts/plex-arabic/arabic-400.woff2',
] as const

/** Kept for call sites that used to spread next/font class names. */
export const fontVariables = ''
