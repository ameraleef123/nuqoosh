#!/usr/bin/env node
/**
 * Main-thread cost of a preview page, for comparing templates or variants.
 *
 * Frame timing turned out to be too noisy on this machine to separate one
 * config from another — identical runs differed as much as different ones did.
 * These are Chrome's own cumulative CPU counters instead, sampled across a
 * fixed scrolling window, which is stable enough to rank changes.
 *
 * Usage: node scripts/perf.mjs '[{"name":"x","url":"...","css":"optional"}]' [repeats]
 */
import puppeteer from 'puppeteer-core'

const targets = JSON.parse(process.argv[2])
const repeats = Number(process.argv[3] ?? 3)
const WINDOW_MS = 5000

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
})

async function sample(t) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
  await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 90000 })
  if (t.css) await page.addStyleTag({ content: t.css })
  const client = await page.createCDPSession()
  await client.send('Performance.enable')
  await new Promise((r) => setTimeout(r, 2500)) // players spin up, decode, compile

  const read = async () => {
    const { metrics } = await client.send('Performance.getMetrics')
    return Object.fromEntries(metrics.map((m) => [m.name, m.value]))
  }
  const before = await read()
  await page.evaluate(
    (ms) =>
      new Promise((resolve) => {
        const start = performance.now()
        const tick = () => {
          window.scrollBy(0, 14)
          if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4)
            window.scrollTo(0, 0)
          if (performance.now() - start < ms) requestAnimationFrame(tick)
          else resolve()
        }
        requestAnimationFrame(tick)
      }),
    WINDOW_MS
  )
  const after = await read()
  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length)
  await page.close()
  const d = (k) => +(((after[k] ?? 0) - (before[k] ?? 0)) * 1000).toFixed(0)
  return { task: d('TaskDuration'), script: d('ScriptDuration'), layout: d('LayoutDuration'), style: d('RecalcStyleDuration'), canvases }
}

// One throwaway pass: the first page in a fresh browser pays for wasm
// compilation and image decoding and is never representative.
await sample(targets[0])

for (const t of targets) {
  const runs = []
  for (let i = 0; i < repeats; i++) runs.push(await sample(t))
  const med = (k) => runs.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(repeats / 2)]
  console.log(
    t.name.padEnd(12),
    `cpu ${String(med('task')).padStart(5)}ms   script ${String(med('script')).padStart(5)}ms   ` +
      `layout ${String(med('layout')).padStart(4)}ms   style ${String(med('style')).padStart(4)}ms   ` +
      `canvas ${runs[0].canvases}   [${runs.map((r) => r.task).join(', ')}]`
  )
}
await browser.close()
