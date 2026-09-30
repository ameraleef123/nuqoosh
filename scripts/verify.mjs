#!/usr/bin/env node
/**
 * Full verification: types, RTL, production build, and the content rules that
 * must hold on the built HTML.
 *
 * Builds into `.next-verify` rather than `.next`, so this can run while the dev
 * server is up without pulling its chunks out from under it.
 *
 * Usage: npm run verify
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = '.next-verify'
const run = (cmd, args, env = {}) =>
  spawnSync(cmd, args, { stdio: 'inherit', shell: true, env: { ...process.env, ...env } })

let failed = 0
const step = (name, fn) => {
  console.log(`\n── ${name} ${'─'.repeat(Math.max(0, 60 - name.length))}`)
  if (fn() === false) failed++
}

step('typecheck', () => run('npx', ['tsc', '--noEmit']).status === 0)
step('RTL guard', () => run('node', ['scripts/check-rtl.mjs']).status === 0)
step('production build', () => run('npx', ['next', 'build'], { NEXT_DIST_DIR: DIST }).status === 0)

step('content rules on built HTML', () => {
  const read = (f) => {
    const p = `${DIST}/server/app/${f}`
    if (!existsSync(p)) throw new Error(`missing ${p}`)
    return readFileSync(p, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '')
  }
  const a = read('layan-shawabkeh.html') // no experience — the default case
  const b = read('omar-rawashdeh.html') // everything populated

  const checks = [
    ['no-experience: experience section absent', !a.includes('خبرة عملية')],
    ['no-experience: activities section absent', !a.includes('نشاطات')],
    ['no-experience: phone absent from the DOM', !a.includes('tel:')],
    ['no-experience: course-project badge shown', a.includes('مشروع مساق')],
    ['no-experience: volunteering framed as leadership', a.includes('تطوّع وقيادة')],
    // The owner removed the report link from the public page; it must stay gone.
    ['no-experience: report link absent', !a.includes('الإبلاغ عن هذه الصفحة')],
    ['free tier shows the badge', a.includes('مبني بنُقوش')],
    ['full: experience section present', b.includes('خبرة عملية')],
    ['full: phone present', b.includes('tel:')],
    ['paid tier hides the badge', !b.includes('مبني بنُقوش')],
    ['html is rtl and Arabic', a.includes('dir="rtl"') && a.includes('lang="ar"')],
    ['no section rendered empty', !/<h2[^>]*>[^<]+<\/h2>\s*<ul[^>]*>\s*<\/ul>/.test(a)],
  ]
  let bad = 0
  for (const [label, ok] of checks) {
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${label}`)
    if (!ok) bad++
  }
  console.log(`  ${checks.length - bad}/${checks.length} passed`)
  return bad === 0
})

/**
 * Third-party resources. The page must load scripts, styles and fonts from
 * this origin only (see the CSP in next.config.mjs): a compromised CDN would
 * otherwise run in the page's context. This walks every built HTML file and
 * every client chunk and fails on any external script/style/font reference,
 * and on the Lottie player falling back to its CDN-hosted WebAssembly.
 */
step('third-party resources', () => {
  const walk = (dir, out = []) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p, out)
      else out.push(p)
    }
    return out
  }
  const htmls = walk(`${DIST}/server/app`).filter((f) => f.endsWith('.html'))
  const chunks = walk(`${DIST}/static`).filter((f) => f.endsWith('.js') || f.endsWith('.css'))

  const external = []
  for (const f of htmls) {
    const html = readFileSync(f, 'utf8')
    // A <script src>, <link rel=stylesheet|preload|modulepreload href>, or
    // @import pointing at another origin. Protocol-relative counts.
    const tags = html.match(/<(?:script|link)\b[^>]*\b(?:src|href)=["'](?:https?:)?\/\/[^"']+["'][^>]*>/gi) ?? []
    for (const t of tags) {
      // Links to a student's own profiles are anchors, not resources.
      if (/^<link\b/i.test(t) && !/rel=["'](?:stylesheet|preload|modulepreload|prefetch)["']/i.test(t)) continue
      external.push(`${f}: ${t.slice(0, 120)}`)
    }
  }
  for (const f of chunks) {
    const src = readFileSync(f, 'utf8')
    for (const m of src.matchAll(/@import\s+(?:url\()?["']?(?:https?:)?\/\/[^"')\s]+/g)) external.push(`${f}: ${m[0]}`)
    for (const m of src.matchAll(/url\(["']?(?:https?:)?\/\/[^"')\s]+\.(?:woff2?|ttf|otf|eot)/g)) external.push(`${f}: ${m[0]}`)
  }
  // The player ships CDN URLs as its DEFAULT; the app must override them.
  const wasmLocal = chunks.some((f) => readFileSync(f, 'utf8').includes('/lottie/dotlottie-player.wasm'))

  const checks = [
    [`no external script/style/font tag in ${htmls.length} built pages`, external.length === 0],
    [`no external @import or font url() in ${chunks.length} client chunks`, external.length === 0],
    ['Lottie WebAssembly is pointed at public/lottie, not a CDN', wasmLocal],
  ]
  for (const e of external) console.log(`  external: ${e}`)
  let bad = 0
  for (const [label, ok] of checks) {
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${label}`)
    if (!ok) bad++
  }
  return bad === 0
})

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} step(s) failed.`)
process.exit(failed === 0 ? 0 : 1)
