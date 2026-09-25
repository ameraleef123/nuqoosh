#!/usr/bin/env node
/**
 * Ad-hoc screenshots: node scripts/shot.mjs <outDir> '<json array of {name,url,width?,height?,selector?}>'
 * `selector` captures one element (e.g. a gallery band) instead of the page.
 * Full-page, motion pinned to its final state (motion-failsafe), Chrome on this machine.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'
const OUT = process.argv[2]
const shots = JSON.parse(process.argv[3])
mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})
for (const s of shots) {
  const page = await browser.newPage()
  await page.setViewport({ width: s.width ?? 1440, height: s.height ?? 900, deviceScaleFactor: 1 })
  await page.goto(s.url, { waitUntil: 'networkidle0', timeout: 90000 })
  await new Promise((r) => setTimeout(r, 1200))
  // `live` skips the failsafe: needed for anything whose END state is offscreen
  // — ساكورا's petals finish below the fold, so a pinned frame shows an empty
  // sky. Everything else is steadier pinned.
  if (!s.live) await page.evaluate(() => document.documentElement.classList.add('motion-failsafe'))
  await new Promise((r) => setTimeout(r, 300))
  if (s.selector) {
    const el = await page.$(s.selector)
    await el.scrollIntoView()
    await new Promise((r) => setTimeout(r, 800))
    await el.screenshot({ path: join(OUT, `${s.name}.png`) })
  } else {
    await page.screenshot({ path: join(OUT, `${s.name}.png`), fullPage: !s.viewportOnly })
  }
  console.log('ok', s.name)
  await page.close()
}
await browser.close()
