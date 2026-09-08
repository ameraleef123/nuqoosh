#!/usr/bin/env node
/**
 * QA screenshot matrix.
 *
 * Uses puppeteer-core against the Chrome already installed on the machine, so
 * nothing is downloaded. Real viewport emulation matters here: Chrome's
 * `--window-size=375` is silently clamped by the OS minimum window width on
 * Windows (it produced a 497px viewport and made the layout look broken), and
 * `--screenshot` only ever captures the viewport, never the full page.
 *
 * Usage:  node scripts/screenshots.mjs [outDir] [baseUrl]
 */
import { mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] ?? 'screenshots'
const BASE = process.argv[3] ?? 'http://localhost:3000'

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chrome or Edge found. Set one of:', CHROME_CANDIDATES.join(', '))
  process.exit(1)
}

const WIDTHS = [375, 768, 1024, 1440]
const TEMPLATES = ['saqee', 'ballour', 'fajr', 'hibr']

/** The matrix the definition of done asks for, plus the two fixtures. */
function plan() {
  const shots = []
  // Every template, both themes, both languages, at 1440.
  for (const t of TEMPLATES) {
    for (const theme of ['light', 'dark']) {
      for (const lang of ['ar', 'en']) {
        shots.push({
          name: `${t}_1440_${lang}_${theme}`,
          url: `${BASE}/preview/${t}?theme=${theme}&lang=${lang}`,
          width: 1440,
        })
      }
    }
  }
  // One template across every breakpoint, both themes, Arabic.
  for (const width of WIDTHS) {
    for (const theme of ['light', 'dark']) {
      shots.push({
        name: `saqee_${width}_ar_${theme}`,
        url: `${BASE}/preview/saqee?theme=${theme}`,
        width,
      })
    }
  }
  // The full fixture, to show the experience section appearing only when it exists.
  shots.push({
    name: 'hibr_1440_ar_dark_FULL',
    url: `${BASE}/preview/hibr?theme=dark&fixture=full`,
    width: 1440,
  })
  // Gallery, both themes.
  for (const theme of ['light', 'dark']) {
    shots.push({ name: `gallery_1440_ar_${theme}`, url: `${BASE}/gallery?theme=${theme}`, width: 1440 })
    shots.push({ name: `gallery_375_ar_${theme}`, url: `${BASE}/gallery?theme=${theme}`, width: 375 })
  }
  // Reduced motion: the page must be fully static and fully visible.
  shots.push({
    name: 'saqee_1440_ar_light_REDUCED_MOTION',
    url: `${BASE}/preview/saqee?theme=light`,
    width: 1440,
    reducedMotion: true,
  })
  // JavaScript disabled: content must still be readable.
  shots.push({
    name: 'saqee_1440_ar_light_NO_JS',
    url: `${BASE}/preview/saqee?theme=light`,
    width: 1440,
    noJs: true,
  })
  return shots
}

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

mkdirSync(OUT, { recursive: true })
let ok = 0
let failed = 0

for (const shot of plan()) {
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: shot.width, height: 900, deviceScaleFactor: 1 })
    if (shot.noJs) await page.setJavaScriptEnabled(false)
    if (shot.reducedMotion) {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    }
    await page.goto(shot.url, { waitUntil: 'networkidle0', timeout: 45000 })

    // Let the entrance animation settle, then pin every section to its final
    // state before capturing.
    //
    // Scroll reveal uses 'play none none reverse', so sections fade back out
    // when they leave the viewport — correct at runtime, but a full-page
    // capture would then show them blank. `motion-failsafe` is the app's own
    // class for "show the final state of everything", so this captures the
    // real end state rather than a mock of it.
    if (!shot.noJs && !shot.reducedMotion) {
      await new Promise((r) => setTimeout(r, 800))
      await page.evaluate(() => document.documentElement.classList.add('motion-failsafe'))
      await new Promise((r) => setTimeout(r, 200))
    }

    await page.screenshot({ path: join(OUT, `${shot.name}.png`), fullPage: true })
    console.log(`  ok   ${shot.name}`)
    ok++
  } catch (err) {
    console.error(`  FAIL ${shot.name}: ${err.message}`)
    failed++
  } finally {
    await page.close()
  }
}

await browser.close()
console.log(`\n${ok} captured, ${failed} failed -> ${OUT}`)
process.exit(failed > 0 ? 1 : 0)
