#!/usr/bin/env node
/**
 * RTL guard: layout code must use CSS logical properties, never physical
 * left/right. Arabic is the primary direction; a stray `ml-4` silently breaks
 * the mirrored layout without throwing anything.
 *
 * Run: npm run check:rtl
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOTS = ['app', 'components', 'lib']
const EXT = new Set(['.ts', '.tsx', '.css'])

// Physical-direction Tailwind utilities that have a logical equivalent.
const BANNED = [
  { re: /(?<![\w-])-?(ml|mr)-(?![a-z])/g, fix: 'ms-/me-' },
  { re: /(?<![\w-])-?(pl|pr)-(?![a-z])/g, fix: 'ps-/pe-' },
  { re: /(?<![\w-])(left|right)-(?![a-z])/g, fix: 'start-/end-' },
  { re: /(?<![\w-])(border-l|border-r)-(?![a-z])/g, fix: 'border-s-/border-e-' },
  { re: /(?<![\w-])(rounded-l|rounded-r)-(?![a-z])/g, fix: 'rounded-s-/rounded-e-' },
  { re: /(?<![\w-])text-(left|right)(?![\w-])/g, fix: 'text-start/text-end' },
  // Raw CSS
  { re: /(?<![-\w])margin-(left|right)\s*:/g, fix: 'margin-inline-start/end' },
  { re: /(?<![-\w])padding-(left|right)\s*:/g, fix: 'padding-inline-start/end' },
  { re: /(?<![-\w])border-(left|right)\s*:/g, fix: 'border-inline-start/end' },
]

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (EXT.has(extname(p))) out.push(p)
  }
  return out
}

let failures = 0
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const src = readFileSync(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    if (line.includes('rtl-ok')) return // explicit, reviewed exception
    for (const { re, fix } of BANNED) {
      re.lastIndex = 0
      const m = re.exec(line)
      if (m) {
        failures++
        console.error(`${file}:${i + 1}  physical "${m[0].trim()}" — use ${fix}`)
        console.error(`    ${line.trim()}`)
      }
    }
  })
}

if (failures > 0) {
  console.error(`\n${failures} physical-direction use(s). Layout must be logical so RTL mirrors.`)
  process.exit(1)
}
console.log('RTL check passed: no physical left/right in layout code.')
