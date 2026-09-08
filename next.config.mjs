/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: { optimizePackageImports: ['lucide-react'] },

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
