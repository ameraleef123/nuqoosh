/**
 * Third-party resources: there are none, and these headers make that a rule
 * the browser enforces rather than a habit.
 *
 * Everything the page loads is served from this origin — fonts are woff2 in
 * public/fonts, art is .lottie in public/lottie, and the Lottie player's
 * WebAssembly is pointed at public/lottie/dotlottie-player.wasm from
 * components/lottie-mark.tsx (its default would fetch from cdn.jsdelivr.net).
 * The Content-Security-Policy below allows scripts, styles, fonts, workers
 * and connections from 'self' only, so a compromised CDN or a stray <script>
 * added later cannot run in the page's context. `npm run verify` also fails
 * the build if any external script, style or font tag appears in the output.
 *
 * Why 'unsafe-inline' for scripts: the App Router streams the RSC payload as
 * inline <script> tags whose content differs per page, so they cannot be
 * hashed, and a per-request nonce would force every prerendered public page
 * to render dynamically. Inline scripts from THIS origin are the only ones
 * allowed; no external host is. 'wasm-unsafe-eval' is what lets the browser
 * compile the self-hosted player binary. 'unsafe-eval' is added only in
 * development, where Next's dev bundler evaluates source maps.
 */
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  // A student's photo is an arbitrary https URL they typed; the QR is a data URI.
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  // Two years, preloadable. Browsers ignore it over plain http, so it is
  // harmless on localhost and binding once the site is served over TLS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: { optimizePackageImports: ['lucide-react'] },

  /**
   * pdf.js resolves its worker relative to its own file. Bundled into Next's
   * vendor chunks that path does not exist ("Cannot find module
   * .next/server/vendor-chunks/pdf.worker.mjs"), so the package is left to
   * Node's normal resolution from node_modules.
   */
  serverExternalPackages: ['pdfjs-dist'],

  /**
   * A verification build must not clobber a running dev server.
   *
   * `next dev` and `next build` both write to `.next` by default, so running a
   * build while the dev server is up replaces the chunks it has open and every
   * request starts failing with MODULE_NOT_FOUND until dev recompiles. Setting
   * NEXT_DIST_DIR sends builds somewhere else, so `npm run verify` is safe to
   * run at any time.
   */
  distDir: process.env.NEXT_DIST_DIR || '.next',
}
export default nextConfig
