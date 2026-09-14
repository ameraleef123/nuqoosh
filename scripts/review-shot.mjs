/**
 * Screenshot /new/review with a parsed CV loaded as the draft.
 * Usage: node scripts/review-shot.mjs <import.json> <outPrefix> [template] [lang] [theme] [width]
 * (<import.json> is the response of POST /api/import.)
 */
import fs from 'node:fs'
import puppeteer from 'puppeteer-core'
const [,, jsonPath, outPrefix, tpl = 'saqee', lang = 'ar', theme = 'light', width = '1440'] = process.argv
const out = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
const draft = { profile: { ...out.profile, templateId: tpl }, found: out.found, unrecognised: out.unrecognised, importedAt: new Date().toISOString() }
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage()
await page.setViewport({ width: +width, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:3000/new', { waitUntil: 'networkidle0', timeout: 120000 })
await page.evaluate((d, l, th) => { localStorage.setItem('nuqush-draft', JSON.stringify(d)); localStorage.setItem('nuqush-lang', l); localStorage.setItem('nuqush-theme', th) }, draft, lang, theme)
await page.goto('http://localhost:3000/new/review', { waitUntil: 'networkidle0', timeout: 120000 })
await new Promise(r => setTimeout(r, 1500))
// Reveal-on-scroll: walk the page so every IntersectionObserver fires.
const total = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < total; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 120)) }
await page.evaluate(() => window.scrollTo(0, 0))
// Reveal reverses on leave, so a tall viewport keeps every section in view for the capture.
await page.setViewport({ width: +width, height: Math.min(total, 16000), deviceScaleFactor: 1 })
await new Promise(r => setTimeout(r, 1200))
const h = await page.evaluate(() => document.documentElement.scrollHeight)
await page.screenshot({ path: `${outPrefix}.png`, fullPage: true })
console.log('height', h, await page.evaluate(() => [document.documentElement.lang, document.documentElement.dataset.theme]))
await browser.close()
