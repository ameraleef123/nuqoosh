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
import { readFileSync, existsSync } from 'node:fs'

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
    ['no-experience: report link present', a.includes('الإبلاغ عن هذه الصفحة')],
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

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} step(s) failed.`)
process.exit(failed === 0 ? 0 : 1)
