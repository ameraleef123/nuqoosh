import 'server-only'

/**
 * Turns an uploaded CV into plain text. Server-side only, with local npm
 * packages — no service is called and the file never leaves the process.
 *
 * PDF is the hard case for Arabic, and the generic "give me the text" helpers
 * get it wrong. What pdf.js actually yields for an Arabic PDF, measured on a
 * Word/Chrome-exported file:
 *
 *   - one item per GLYPH, in the font's presentation form (ﺔ ﻛ ﺑ, U+FExx),
 *     not the base letters;
 *   - items in VISUAL order, left to right, so an Arabic word arrives
 *     back-to-front while a Latin word in the same line arrives forwards;
 *   - a shadda or kasra as its own item, which naive line-joining turns into
 *     a line break, splitting «المعدّل» into «المعد», «ّ», «ل».
 *
 * So the text is rebuilt from coordinates: items are grouped into lines by
 * their y, sorted by x, split into runs by script, the runs are reversed and
 * the items inside each Arabic run are reversed, lone diacritics are dropped,
 * and NFKC folds the presentation forms back to real letters.
 */

export type CvKind = 'pdf' | 'docx' | 'txt'

export const MAX_BYTES = 4 * 1024 * 1024 // Vercel's function body limit is ~4.5 MB

export function kindOf(name: string, mime: string): CvKind | null {
  const n = name.toLowerCase()
  if (n.endsWith('.pdf') || mime === 'application/pdf') return 'pdf'
  if (n.endsWith('.docx') || mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx'
  if (n.endsWith('.txt') || mime === 'text/plain') return 'txt'
  return null
}

export async function extractText(buf: Buffer, kind: CvKind): Promise<string> {
  if (kind === 'txt') return canonical(buf.toString('utf8'))

  if (kind === 'docx') {
    const mammoth = await import('mammoth')
    const { value } = await mammoth.extractRawText({ buffer: buf })
    return canonical(value)
  }

  return canonical(await extractPdf(buf))
}

/* ── PDF ───────────────────────────────────────────────────────────────────── */

type Item = { str: string; x: number; y: number; w: number }

const ARABIC_LETTER = /[ؠ-يٮ-ۓۺ-ۿﭐ-﷿ﹰ-﻿]/
const ONLY_MARKS = /^[ً-ْٰۖ-ۭﹰ-ﹿ]+$/
const ONLY_SPACE = /^\s+$/

async function extractPdf(buf: Buffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise

  const pages: string[] = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const tc = await page.getTextContent()
    const items: Item[] = []
    for (const it of tc.items) {
      if (!('str' in it) || !it.str || ONLY_MARKS.test(it.str)) continue
      // Some producers emit the word space as its own zero-width item. Keep it
      // as a space marker; readingOrder measures gaps between real glyphs.
      items.push({ str: it.str, x: it.transform[4], y: it.transform[5], w: it.width })
    }
    pages.push(linesFromItems(items).join('\n'))
    page.cleanup()
  }
  await doc.cleanup()
  return pages.join('\n\n')
}

/** Group by baseline (top of page first), then rebuild each line's reading order. */
function linesFromItems(items: Item[]): string[] {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
  const lines: Item[][] = []
  for (const it of sorted) {
    const line = lines[lines.length - 1]
    // Same baseline within 3 units → same line. Font size makes this generous
    // enough for a shadda that sits a little above its letter.
    if (line && Math.abs(line[0].y - it.y) <= 3) line.push(it)
    else lines.push([it])
  }
  return lines.map((line) => readingOrder(line.sort((a, b) => a.x - b.x)))
}

/**
 * Visual → logical. Runs of Arabic-letter items read right-to-left, so both
 * the order of runs and the order of items inside an Arabic run are reversed;
 * Latin and digit runs keep their order. A neutral item (space, punctuation)
 * joins whichever run it is next to.
 */
function readingOrder(visual: Item[]): string {
  const arabicCount = visual.filter((i) => ARABIC_LETTER.test(i.str)).length
  const rtlLine = arabicCount * 2 > visual.length

  type Run = { rtl: boolean; items: Item[] }
  const runs: Run[] = []
  for (const it of visual) {
    const hasAr = ARABIC_LETTER.test(it.str)
    const hasLatinOrDigit = /[A-Za-z0-9٠-٩]/.test(it.str)
    const rtl = hasAr ? true : hasLatinOrDigit ? false : (runs[runs.length - 1]?.rtl ?? rtlLine)
    const last = runs[runs.length - 1]
    if (last && last.rtl === rtl) last.items.push(it)
    else runs.push({ rtl, items: [it] })
  }

  const ordered = rtlLine ? [...runs].reverse() : runs
  let out = ''
  for (const run of ordered) {
    const seq = run.rtl ? [...run.items].reverse() : run.items
    let prev: Item | undefined
    let pendingSpace = false
    for (const it of seq) {
      // Only a space with real width is a word space; Arabic producers also
      // emit zero-width " " items in the middle of a word, before a mark.
      if (ONLY_SPACE.test(it.str)) {
        if (it.w > 0.5) pendingSpace = true
        continue
      }
      // A small gap is a word space. A LARGE one is a table cell boundary —
      // measured 42–45 units between a skills label and its list, against 0
      // inside running text — and is emitted as a tab so the parser can see
      // the column. Justified text never opens a gap anywhere near 12.
      if (prev && !/\s$/.test(out) && !/^\s/.test(it.str)) {
        const gap = run.rtl ? prev.x - (it.x + it.w) : it.x - (prev.x + prev.w)
        if (gap > 12) out += '\t'
        else if (pendingSpace || gap > 2.5) out += ' '
      }
      out += it.str
      prev = it
      pendingSpace = false
    }
    if (!/\s$/.test(out)) out += ' '
  }
  return out.replace(/[  ]+/g, ' ').replace(/ ?	 ?/g, '	').trim()
}

/* ── Canonical letters ─────────────────────────────────────────────────────── */

/**
 * Fold presentation forms and font-specific variants to plain Arabic letters.
 * This is applied to the STORED text, so it must not change spelling: it maps
 * shapes of the same letter, never one letter to another.
 */
export function canonical(s: string): string {
  return s
    .normalize('NFKC')
    .replace(/[یے]/g, 'ي') // Persian/Urdu yeh → yeh
    .replace(/ک/g, 'ك') // keheh → kaf
    .replace(/[ھە]/g, 'ه') // heh doachashmee / ae → heh
    .replace(/ـ/g, '') // tatweel
    .replace(/\r\n?/g, '\n')
}
