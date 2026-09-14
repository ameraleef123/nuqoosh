import type { Profile, LocalizedText } from '@/lib/schema'
import { toArabicHandle, toLatinHandle } from '@/lib/handle'

/**
 * Rule-based CV parser. Local, free, and honest about its limits.
 *
 * It turns the plain text of a CV into a Profile using section headings,
 * layout cues and a few patterns (email, phone, URL, dates, GPA). Anything it
 * does not recognise it leaves EMPTY — and an empty section is never rendered —
 * so the worst case is a sparse page, never an invented one. The student fixes
 * gaps in the wizard.
 *
 * Text arrives from lib/import/extract.ts with two conventions that matter:
 *   - a TAB marks a table-cell boundary (a skills label and its list);
 *   - letter-spaced headings arrive as "P R O F E S S I O N A L S U M M A R Y".
 *
 * It reads Arabic and English, and stores each line in the language it was
 * written in: Arabic goes to `ar`, Latin to `en`. The wizard asks for the
 * missing side.
 *
 * A note on \b: JavaScript's word boundary is ASCII-only. Between an Arabic
 * letter and a space it does NOT match, so any pattern ending in \b silently
 * fails on Arabic. Patterns here use (?=\s|$) or explicit classes instead.
 */

/* ── Text helpers ──────────────────────────────────────────────────────────── */

/** True when the line is mostly Arabic letters. */
export function isArabic(s: string): boolean {
  const letters = s.replace(/[^\p{L}]/gu, '')
  if (!letters) return false
  const ar = (letters.match(/[؀-ۿ]/g) ?? []).length
  return ar / letters.length > 0.5
}

/** Normalise the forms that make Arabic matching flaky. Matching only. */
export function normalizeArabic(s: string): string {
  return s
    .replace(/ـ/g, '')
    .replace(/[ً-ْ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة(?=\s|$)/g, 'ه')
}

function clean(s: string): string {
  return s
    .replace(/[  ]+/g, ' ')
    .replace(/[•▪◦●■□➢➤►▸‣⁃·]/g, '•')
    .trim()
}

function lt(line: string): LocalizedText {
  const t = line.trim()
  return isArabic(t) ? { ar: t } : { ar: '', en: t }
}

function mergeLt(a: LocalizedText | undefined, b: LocalizedText): LocalizedText {
  if (!a) return b
  return { ar: a.ar || b.ar, en: a.en || b.en }
}

function toWesternDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/٫/g, '.')
}

let idCounter = 0
const id = (p: string) => `${p}${++idCounter}`

/* ── Section headings ──────────────────────────────────────────────────────── */

export type SectionKind =
  | 'about'
  | 'education'
  | 'projects'
  | 'volunteering'
  | 'activities'
  | 'experience'
  | 'skills'
  | 'languages'
  | 'links'
  | 'other'

/**
 * Keywords are matched against the heading with everything but letters
 * removed, so «P R O F E S S I O N A L  E X P E R I E N C E», "Work
 * Experience" and «الخبرات العملية» all land. First hit wins, so the more
 * specific words come first.
 */
const HEADING_KEYS: Array<[SectionKind, string[]]> = [
  ['volunteering', ['volunteer', 'community', 'التطوع', 'تطوع', 'العملالتطوعي', 'الاعمالالتطوعيه']],
  ['activities', ['activit', 'extracurricular', 'achievement', 'award', 'honor', 'certif', 'النشاطات', 'الانشطه', 'نشاطات', 'الانجازات', 'الجوائز', 'الشهادات', 'الدورات']],
  ['projects', ['project', 'portfolio', 'المشاريع', 'مشاريع']],
  ['experience', ['experience', 'employment', 'internship', 'workhistory', 'career', 'الخبرات', 'الخبره', 'خبرات', 'خبره', 'العمل', 'التدريب']],
  ['education', ['education', 'academic', 'qualification', 'التعليم', 'الدراسه', 'المؤهلات', 'التحصيل']],
  ['languages', ['language', 'اللغات', 'لغات']],
  ['skills', ['skill', 'competenc', 'technolog', 'expertise', 'المهارات', 'مهارات', 'التقنيات']],
  ['about', ['summary', 'profile', 'about', 'objective', 'نبذه', 'عني', 'الملخص', 'ملخص', 'الهدف']],
  ['links', ['contact', 'links', 'reachme', 'التواصل', 'معلوماتالتواصل', 'للتواصل', 'بياناتالاتصال']],
]

/**
 * Letter-spaced headings come out of pdf.js with spaces in odd places:
 * "P RO F ES S I O N A L S U M M A RY". An all-caps line whose tokens average
 * under three letters is one of those, and its spaces mean nothing.
 */
function unspaceLetters(s: string): string {
  const t = s.trim()
  if (/\p{Ll}/u.test(t)) return t
  const tokens = t.split(' ')
  return tokens.length > 1 && t.replace(/ /g, '').length / tokens.length < 3 ? t.replace(/ /g, '') : t
}

function headingKind(rawLine: string): SectionKind | null {
  const line = unspaceLetters(clean(rawLine)).replace(/[:：\-–—_|]+$/g, '').trim()
  if (!line || line.length > 40) return null
  // Headings are short. A sentence that happens to contain "project" is not one.
  if (line.split(/\s+/).length > 4) return null
  // A heading has no sentence punctuation and no digits.
  if (/[.,;؛،]\s|\d/.test(line)) return null
  const key = normalizeArabic(line).toLowerCase().replace(/[^\p{L}]/gu, '')
  if (key.length < 3) return null
  for (const [kind, words] of HEADING_KEYS) if (words.some((w) => key.includes(w))) return kind
  return null
}

/* ── Field patterns ────────────────────────────────────────────────────────── */

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g
/** Known hosts with a path, or a lowercase bare domain. Uppercase "ASP.NET" is not a site. */
const URL =
  /(?:https?:\/\/)?(?:www\.)?(?:(?:linkedin\.com|github\.com|gitlab\.com|behance\.net|dribbble\.com|x\.com|twitter\.com|instagram\.com|medium\.com)\/[\w./@-]+|(?<![\w.])[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|io|me|dev|org|jo|app|co|sa|ae)(?:\/[\w./-]*)?(?![\w.]))/g
const PHONE = /(?:\+?962[\s-]?|0)7[789][\s-]?\d{3}[\s-]?\d{4}(?!\d)/
const GPA = /(?:معدل|gpa)\s*[:：]?\s*(\d(?:[.,]\d{1,2})?)/i
const GPA_PHRASE =
  /\s*[—–|,،]?\s*(?:ال)?معد[ّ]?ل\s*[:：]?\s*[\d٠-٩][.,٫]?[\d٠-٩]{0,2}(?:\s*(?:من|\/|out of)\s*[\d٠-٩](?:[.,٫][\d٠-٩])?)?|\s*[—–|,،]?\s*gpa\s*[:：]?\s*\d(?:[.,]\d{1,2})?(?:\s*(?:\/|out of)\s*\d(?:\.\d)?)?/gi
const YEAR_AR: Array<[RegExp, number]> = [
  [/سنه (اولي|أولى|اولى)|السنه (الاولي|الأولى)|first year|1st year|freshman/i, 1],
  [/سنه ثانيه|السنه الثانيه|second year|2nd year|sophomore/i, 2],
  [/سنه ثالثه|السنه الثالثه|third year|3rd year|junior/i, 3],
  [/سنه رابعه|السنه الرابعه|fourth year|4th year|senior/i, 4],
]
const GRAD_YEAR = /(?:تخرج|graduat|expected|class of)\D{0,20}(20\d{2})/i
const COURSE = /(مساق|course|مقرر|coursework|class project|صف)/i
const TEAM = /(فريق|team|group|جماعي|زملاء)/i
const UNIVERSITY = /(جامعه|جامعة|كليه|كلية|معهد|university|college|institute|academy|school)/i
const DEGREE = /(بكالوريوس|ماجستير|دبلوم|هندسه|هندسة|علم|علوم|تخصص|bachelor|b\.?sc|b\.?a(?=\s|$)|master|m\.?sc|diploma|major|degree|engineering|science|computer)/i

const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?'
const MONTH_AR = '(?:كانون|شباط|آذار|اذار|نيسان|أيار|ايار|حزيران|تموز|آب|اب|أيلول|ايلول|تشرين)(?:\\s+(?:الثاني|الاول|الأول))?'
const YEAR = '(?:19|20)\\d{2}'
const PRESENT = '(?:present|current|now|ongoing|today|حاليا|حالياً|الان|الآن|حتى الان|حتى الآن)'
/** "Dec 2025 – Present", "2018 – 2020", "2025 · Dubai", "Jan 2024 - Aug 2024 · Remote". */
const DATE_LINE = new RegExp(
  `^(?:(?:${MONTH}|${MONTH_AR})\\s+)?${YEAR}\\s*(?:[–—-]\\s*(?:${PRESENT}|(?:(?:${MONTH}|${MONTH_AR})\\s+)?${YEAR}))?(?:\\s*[·•|,،]\\s*.{0,60})?$`,
  'i'
)
const DATE_RANGE = new RegExp(
  `((?:(?:${MONTH}|${MONTH_AR})\\s+)?${YEAR})\\s*(?:[–—-]\\s*(${PRESENT}|(?:(?:${MONTH}|${MONTH_AR})\\s+)?${YEAR}))?`,
  'i'
)
const PRESENT_RE = new RegExp(`^${PRESENT}$`, 'i')

/** Category labels that lead a skills row; also decide the skill group. */
const SKILL_LABEL =
  /^(front[- ]?end|back[- ]?end|full[- ]?stack|ui(?: & ux| ?\/ ?ux)?(?: & styling| engineering| design)?|databases?|tools?(?: & workflow)?|frameworks?|languages?|programming(?: languages)?|soft skills?|technical(?: skills)?|other|cloud|devops|mobile|design|testing|data|المهارات التقنيه|المهارات الشخصيه|اللغات|الادوات|قواعد البيانات|الواجهات|الخلفيه)\s*[:：]?\s+(?=\S)/i

function skillGroup(label: string): 'technical' | 'language' | 'soft' {
  const l = normalizeArabic(label).toLowerCase()
  if (/soft|شخصي|communication|تواصل/.test(l)) return 'soft'
  if (/language|لغات|لغه/.test(l)) return 'language'
  return 'technical'
}

/** "الإنجليزية جيد جدًا", "English — Professional": a language, wherever it sits. */
const LANGUAGE_NAME =
  /^(?:arabic|english|french|german|spanish|turkish|italian|chinese|japanese|korean|russian|العربيه|الانجليزيه|الانكليزيه|الفرنسيه|الالمانيه|الاسبانيه|التركيه|الايطاليه|الصينيه|اليابانيه|الكوريه|الروسيه|لغه)(?=\s|$|\s*[—–:(])/i

/* ── Splitting helpers ─────────────────────────────────────────────────────── */

const BULLET = /^(•|[-–—*]|\d+[.)]|[أ-ي]\)|[a-z]\))\s+/i

/** Short, no sentence punctuation, not lowercase-led: reads as a title line. */
function looksLikeTitle(line: string): boolean {
  const t = line.trim()
  if (!t || t.length > 70) return false
  if (BULLET.test(t) || DATE_LINE.test(toWesternDigits(t))) return false
  if (t.split(/\s+/).length > 8) return false
  if (/[.;؛]\s*$/.test(t) || /[.;؛]\s+\S/.test(t)) return false
  if (/^[a-z]/.test(t)) return false
  return true
}

/** "title — rest" split on the first strong separator, else first sentence. */
function splitTitle(text: string): { title: string; rest: string } {
  const sep = text.match(/\s+[—–|:]\s+|\s+-\s+/)
  if (sep && sep.index !== undefined && sep.index > 2) {
    return { title: text.slice(0, sep.index).trim(), rest: text.slice(sep.index + sep[0].length).trim() }
  }
  const sentence = text.match(/^(.{6,90}?[.؟!])\s+(.+)$/s)
  if (sentence) return { title: sentence[1].replace(/[.؟!]$/, ''), rest: sentence[2] }
  if (text.length <= 90) return { title: text, rest: '' }
  const cut = text.lastIndexOf(' ', 80)
  return { title: text.slice(0, cut > 20 ? cut : 80), rest: text.slice(cut > 20 ? cut : 80).trim() }
}

/** "role — organization" for a single-line entry. */
function splitRoleOrg(text: string): { role: string; org: string } {
  const m = text.match(/^(.+?)\s+(?:[—–|@]|at|في|لدى|مع|with)\s+(.+)$/i)
  if (m) return { role: m[1].trim(), org: m[2].trim() }
  const { title, rest } = splitTitle(text)
  return { role: title, org: rest }
}

/** Trailing "React, Node.js, Prisma" after the last sentence → tools. */
function splitTools(text: string): { body: string; tools: string[] } {
  // Greedy: the tail starts after the LAST sentence end, so "Node.js" and
  // ".NET Core" inside it are fine; a tail with its own sentence is not one.
  const m = text.match(/^(.*[.؟!])\s+(\S.{2,120})$/s)
  if (!m || /[.؟!]\s/.test(m[2])) return { body: text, tools: [] }
  const parts = m[2].trim().split(/\s*[,،]\s*/).map((t) => t.trim()).filter(Boolean)
  const toolish =
    parts.length >= 2 && parts.length <= 10 && parts.every((t) => t.length <= 28 && t.split(/\s+/).length <= 3)
  return toolish ? { body: m[1].trim(), tools: parts } : { body: text, tools: [] }
}

function parseDates(line: string): { from?: string; to?: string; location?: string } {
  const m = line.match(DATE_RANGE)
  if (!m) return {}
  const from = m[1]?.trim()
  const to = m[2] ? (PRESENT_RE.test(m[2].trim()) ? 'present' : m[2].trim()) : from
  const after = line.slice((m.index ?? 0) + m[0].length).replace(/^\s*[·•|,،]\s*/, '').trim()
  return { from, to, location: after || undefined }
}

type Entry = { role: string; org: string; from?: string; to?: string; body: string[] }

/**
 * Entries anchored on date lines: [role, organisation?, DATE, ...bullets].
 * Returns [] when the block has no date line so the caller can fall back.
 */
function dateAnchoredEntries(lines: string[]): Entry[] {
  const L = lines.map(clean).filter(Boolean)
  const dateIdx = L.map((l, i) => (DATE_LINE.test(toWesternDigits(l)) ? i : -1)).filter((i) => i >= 0)
  if (!dateIdx.length) return []

  const entries: Entry[] = []
  let cursor = 0
  for (const d of dateIdx) {
    // The role and organisation are the (up to) two title-like lines just
    // above the date; whatever sits before them is the previous entry's body.
    const above = L.slice(cursor, d)
    let role = ''
    let org = ''
    let used = 0
    if (above.length >= 2 && looksLikeTitle(above[above.length - 1]) && looksLikeTitle(above[above.length - 2])) {
      role = above[above.length - 2]
      org = above[above.length - 1]
      used = 2
    } else if (above.length >= 1) {
      const split = splitRoleOrg(above[above.length - 1])
      role = split.role
      org = split.org
      used = 1
    }
    const spill = above.slice(0, above.length - used)
    if (entries.length && spill.length) entries[entries.length - 1].body.push(...spill)
    const { from, to } = parseDates(toWesternDigits(L[d]))
    entries.push({ role, org, from, to, body: [] })
    cursor = d + 1
  }
  entries[entries.length - 1].body.push(...L.slice(cursor))
  for (const e of entries) e.body = e.body.map((b) => b.replace(BULLET, '').trim()).filter(Boolean)
  return entries
}

/** Items are bullets, titled lines, or blank-separated paragraphs. */
function items(lines: string[]): string[][] {
  const out: string[][] = []
  let cur: string[] = []
  let blankBefore = false
  for (const raw of lines) {
    const line = clean(raw)
    if (!line) {
      blankBefore = true
      continue
    }
    const bullet = BULLET.test(line)
    const titled = /^.{3,60}?\s[—–]\s/.test(line)
    if (bullet || titled || blankBefore || cur.length === 0) {
      if (cur.length) out.push(cur)
      cur = [line.replace(BULLET, '')]
    } else {
      cur.push(line)
    }
    blankBefore = false
  }
  if (cur.length) out.push(cur)
  return out
}

/**
 * Projects printed as a "Title" line followed by description line(s). A title
 * line is short and unpunctuated and the line after it is longer prose.
 */
function titledItems(lines: string[]): string[][] {
  const L = lines.map(clean).filter(Boolean)
  const out: string[][] = []
  let cur: string[] = []
  for (let i = 0; i < L.length; i++) {
    const line = L[i]
    const next = L[i + 1]
    const startsNew =
      BULLET.test(line) ||
      /^.{3,60}?\s[—–]\s/.test(line) ||
      (looksLikeTitle(line) && next !== undefined && next.length > line.length && !looksLikeTitle(next))
    if (startsNew && cur.length) {
      out.push(cur)
      cur = []
    }
    cur.push(line.replace(BULLET, ''))
  }
  if (cur.length) out.push(cur)
  return out
}

/* ── The parser ────────────────────────────────────────────────────────────── */

export type ParseResult = {
  profile: Profile
  found: SectionKind[]
  unrecognised: string[]
}

type LinkKind = Profile['sections']['links'][number]['kind']

export function parseCv(text: string): ParseResult {
  idCounter = 0
  // A line wrapped at a hyphen ("Front-" / "End, …") is one line.
  const lines = text
    .replace(/\r\n?/g, '\n')
    .replace(/(\p{L})-\n(?=\p{L})/gu, '$1-')
    .split('\n')

  // 1) Blocks by heading. Two headings on one line, tab-separated, mean a
  //    two-column layout ("EDUCATION<TAB>LANGUAGES"): the lines that follow
  //    are split at the tab into one block per column until the next heading.
  const blocks: Array<{ kind: SectionKind; lines: string[] }> = [{ kind: 'other', lines: [] }]
  let columns: Array<{ kind: SectionKind; lines: string[] }> | null = null
  for (const line of lines) {
    const cells = line.split('	')
    const cellKinds = cells.map(headingKind)
    if (cells.length > 1 && cellKinds.every(Boolean)) {
      columns = cellKinds.map((kind) => ({ kind: kind as SectionKind, lines: [] }))
      blocks.push(...columns)
      continue
    }
    const kind = headingKind(line)
    if (kind) {
      columns = null
      blocks.push({ kind, lines: [] })
    } else if (columns) {
      cells.forEach((cell, i) => columns![Math.min(i, columns!.length - 1)].lines.push(cell))
    } else {
      blocks[blocks.length - 1].lines.push(line)
    }
  }

  const profile: Profile = {
    handle: '',
    latinHandle: '',
    templateId: 'saqee',
    theme: 'system',
    plan: 'free',
    fields: { fullName: { ar: '' } },
    sections: { projects: [], volunteering: [], activities: [], experience: [], skills: [], links: [] },
  }
  const found = new Set<SectionKind>()
  const unrecognised: string[] = []
  const seenLinks = new Set<string>()

  // 2) Contact details, from anywhere; every URL on a line, not just the first.
  const addLink = (kind: LinkKind, value: string) => {
    const v = value.trim().replace(/[.,;:]+$/, '')
    if (!v || seenLinks.has(v.toLowerCase())) return
    seenLinks.add(v.toLowerCase())
    profile.sections.links.push({ id: id('l'), kind, value: v })
    found.add('links')
  }
  for (const raw of lines) {
    const line = clean(raw)
    for (const e of line.match(EMAIL) ?? []) addLink('email', e)
    const p = toWesternDigits(line).match(PHONE)
    if (p) addLink('phone', p[0].replace(/[\s-]/g, ''))
    for (const u of line.replace(EMAIL, ' ').match(URL) ?? []) {
      const kind: LinkKind = /linkedin/i.test(u)
        ? 'linkedin'
        : /github|gitlab/i.test(u)
          ? 'github'
          : /behance|dribbble/i.test(u)
            ? 'behance'
            : /x\.com|twitter/i.test(u)
              ? 'x'
              : /instagram/i.test(u)
                ? 'instagram'
                : 'website'
      addLink(kind, u)
    }
  }

  // 3) The header block: name, a second-script name, tagline, location.
  const stripContact = (l: string) =>
    l
      .replace(EMAIL, '')
      .replace(URL, '')
      .replace(PHONE, '')
      .replace(/\s*[·•|]\s*/g, ' · ')
      .replace(/(\s*·\s*)+/g, ' · ')
      .replace(/^\s*·\s*|\s*·\s*$/g, '')
      .trim()
  const header = blocks[0].lines.map(clean).filter(Boolean)
  const hasContact = (l: string) => {
    EMAIL.lastIndex = 0
    URL.lastIndex = 0
    return EMAIL.test(l) || URL.test(l) || PHONE.test(toWesternDigits(l))
  }
  const nameIdx = header.findIndex((l) => l.split(/\s+/).length <= 5 && !hasContact(l) && !/\d/.test(l))
  const nameLine = nameIdx >= 0 ? header[nameIdx] : undefined
  if (nameLine) profile.fields.fullName = lt(nameLine)

  const consumed = new Set<number>([nameIdx])
  const alt = header[nameIdx + 1]
  if (
    nameLine &&
    alt &&
    alt.split(/\s+/).length <= 5 &&
    isArabic(alt) !== isArabic(nameLine) &&
    !/[\d@]/.test(alt) &&
    !hasContact(alt)
  ) {
    profile.fields.fullName = mergeLt(profile.fields.fullName, lt(alt))
    consumed.add(nameIdx + 1)
  }
  const LOCATION =
    /(?:^|·\s*)((?:[A-Z][\w'’.-]+(?:\s[A-Z][\w'’.-]+)*,\s*)?(?:Jordan|Amman|Irbid|Zarqa|Aqaba|Salt|Madaba|Karak|Mafraq|Jerash|Ajloun|Tafilah|Ma'an|KSA|Saudi Arabia|UAE|Dubai|Qatar|Kuwait|Bahrain|Oman|Egypt|Palestine|Remote)|(?:[؀-ۿ][^·|,،]{1,30}[،,]\s*)?(?:الأردن|الاردن|عم[اّ]ن|إربد|اربد|الزرقاء|العقبة|السلط|مادبا|الكرك|المفرق|جرش|عجلون|الطفيلة|معان|السعودية|الإمارات|الامارات|قطر|الكويت|البحرين|عُمان|مصر|فلسطين))(?=\s*·|$)/
  for (let i = nameIdx + 1; i < Math.min(header.length, nameIdx + 7); i++) {
    if (consumed.has(i)) continue
    const l = header[i]
    const rest = stripContact(l)
    if (!rest) continue
    const loc = rest.match(LOCATION)
    if (loc && !profile.fields.location) {
      profile.fields.location = lt(loc[1].trim())
      const remainder = rest.replace(loc[0], '').replace(/^\s*·\s*|\s*·\s*$/g, '').trim()
      if (!remainder) continue
    }
    // The tagline: a short role line with no contact data in it.
    if (!profile.fields.tagline && rest === l && l.length >= 6 && l.length <= 140 && l.split(/\s+/).length <= 14) {
      profile.fields.tagline = lt(l)
      continue
    }
  }

  // 4) Each heading block.
  for (const block of blocks.slice(1)) {
    const raw = block.lines.map(clean)
    if (!raw.some(Boolean)) continue
    found.add(block.kind)

    switch (block.kind) {
      case 'about': {
        profile.fields.about = lt(raw.filter(Boolean).join(' '))
        break
      }

      case 'education': {
        const edu = profile.sections.education ?? { university: { ar: '' }, major: { ar: '' }, gpaScale: 4 as const }
        for (const l of raw.filter(Boolean)) {
          const w = toWesternDigits(l)
          const g = w.match(GPA)
          if (g) edu.gpa = Math.min(4, parseFloat(g[1].replace(',', '.')))
          for (const [re, y] of YEAR_AR) if (re.test(normalizeArabic(l))) edu.year = y
          const gy = w.match(GRAD_YEAR)
          if (gy) edu.expectedGraduation = parseInt(gy[1], 10)
          // "2018 – 2022": the end of the range is the graduation year.
          const range = w.match(new RegExp(`${YEAR}\\s*[–—-]\\s*(${YEAR}|${PRESENT})`, 'i'))
          if (range && !edu.expectedGraduation && /^\d/.test(range[1])) edu.expectedGraduation = parseInt(range[1], 10)
          if (DATE_LINE.test(w)) continue
          const n = normalizeArabic(l)
          const stripped = l.replace(GPA_PHRASE, '').trim()
          if (UNIVERSITY.test(n) && !edu.university.ar && !edu.university.en) edu.university = lt(stripped)
          else if (DEGREE.test(n) && !edu.major.ar && !edu.major.en) edu.major = lt(stripped)
        }
        if ((edu.university.ar || edu.university.en) && !edu.major.ar && !edu.major.en) {
          const src = edu.university.ar || edu.university.en || ''
          const { title, rest } = splitTitle(src)
          if (rest && UNIVERSITY.test(normalizeArabic(rest)) && DEGREE.test(normalizeArabic(title))) {
            edu.major = lt(title)
            edu.university = lt(rest)
          }
        }
        if (edu.university.ar || edu.university.en || edu.major.ar || edu.major.en) profile.sections.education = edu
        break
      }

      case 'projects': {
        const hasBullets = raw.some((l) => BULLET.test(l))
        const hasBlanks = raw.some((l, i) => !l && i > 0 && i < raw.length - 1)
        const its = hasBullets || hasBlanks ? items(raw) : titledItems(raw)
        for (const it of its) {
          let title: string
          let rest: string
          if (it.length > 1 && looksLikeTitle(it[0])) {
            title = it[0]
            rest = it.slice(1).join(' ')
          } else {
            const s = splitTitle(it.join(' '))
            title = s.title
            rest = s.rest
          }
          const { body, tools } = splitTools(rest)
          const all = toWesternDigits(`${title} ${rest}`)
          const n = normalizeArabic(all)
          const year = all.match(/(?<!\d)(20\d{2})(?!\d)/)
          profile.sections.projects.push({
            id: id('p'),
            title: lt(title),
            description: body ? lt(body) : undefined,
            kind: COURSE.test(n) ? 'course' : TEAM.test(n) ? 'team' : 'personal',
            tools,
            year: year ? parseInt(year[1], 10) : undefined,
          })
        }
        break
      }

      case 'experience':
      case 'volunteering': {
        const dated = dateAnchoredEntries(raw)
        const list: Entry[] = dated.length
          ? dated
          : items(raw).map((it) => {
              const { role, org } = splitRoleOrg(it[0])
              return { role, org, body: it.slice(1) }
            })
        for (const e of list) {
          const summary = e.body.join(' ')
          if (block.kind === 'experience') {
            profile.sections.experience.push({
              id: id('e'),
              role: lt(e.role),
              employer: lt(e.org || e.role),
              from: e.from,
              to: e.to,
              summary: summary ? lt(summary) : undefined,
            })
          } else {
            profile.sections.volunteering.push({
              id: id('v'),
              role: lt(e.role),
              organization: lt(e.org || e.role),
              from: e.from,
              to: e.to,
              impact: summary ? lt(summary) : undefined,
            })
          }
        }
        break
      }

      case 'activities':
        for (const it of items(raw)) {
          const { title, rest } = splitTitle(it.join(' '))
          profile.sections.activities.push({ id: id('a'), title: lt(title), detail: rest ? lt(rest) : undefined })
        }
        break

      case 'skills':
      case 'languages': {
        // Rows: "Label<TAB>a, b, c", "Label: a, b, c", "English — Native" or
        // just "a, b, c". A row with no label continues the previous group.
        let group: 'technical' | 'language' | 'soft' = block.kind === 'languages' ? 'language' : 'technical'
        // A wrapped cell arrives as a second line with no label: "…, Design" /
        // "Systems, …". Glue it back so "Design Systems" is one skill.
        const rows: string[] = []
        for (const l of raw.filter(Boolean)) {
          const prev = rows[rows.length - 1]
          const continues = prev && prev.includes(',') && !/[,،]\s*$/.test(prev) && !l.includes('	') && !SKILL_LABEL.test(l)
          if (continues) rows[rows.length - 1] = `${prev} ${l}`
          else rows.push(l)
        }
        for (const l of rows) {
          let list = l
          if (l.includes('\t')) {
            const [label, ...rest] = l.split('\t')
            group = skillGroup(label)
            list = rest.join(' ')
          } else {
            const m = l.match(SKILL_LABEL)
            if (m) {
              group = skillGroup(m[1])
              list = l.slice(m[0].length)
            }
          }
          const parts = list
            .split(/\s*(?:[•,،|؛;]|\s{2,})\s*/)
            .map((s) => s.replace(BULLET, '').trim())
            .filter((s) => s && s.length <= 48)
          for (const p of parts) {
            const isLang = block.kind === 'languages' || LANGUAGE_NAME.test(normalizeArabic(p))
            profile.sections.skills.push({ id: id('s'), name: lt(p), group: isLang ? 'language' : group })
          }
        }
        break
      }

      case 'links':
        break

      case 'other':
        unrecognised.push(raw.join('\n').trim())
        break
    }
  }

  // 5) The study year is usually in the tagline, not under a heading.
  if (profile.sections.education && profile.sections.education.year === undefined) {
    const all = normalizeArabic(text)
    for (const [re, y] of YEAR_AR) if (re.test(all)) profile.sections.education.year = y
  }

  // 6) Handles: Latin from the Latin name, else transliterated from the Arabic.
  const { ar, en } = profile.fields.fullName
  profile.latinHandle = toLatinHandle(en || ar || 'me')
  profile.handle = ar ? toArabicHandle(ar) : profile.latinHandle

  const foundList = [...found].map((k) => (k === 'languages' ? 'skills' : k))
  return { profile, found: [...new Set(foundList)], unrecognised: unrecognised.filter(Boolean) }
}
