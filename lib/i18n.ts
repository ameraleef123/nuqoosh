import type { LocalizedText } from './schema'

export type Lang = 'ar' | 'en'
export type Dir = 'rtl' | 'ltr'

export const DEFAULT_LANG: Lang = 'ar'

export function dirFor(lang: Lang): Dir {
  return lang === 'ar' ? 'rtl' : 'ltr'
}

/**
 * Per-field resolution, never all-or-nothing.
 * In English mode a field with no `en` falls back to its Arabic value, and the
 * caller is told so it can stamp lang/dir on that node alone.
 */
export function resolveField(
  value: LocalizedText | undefined,
  lang: Lang
): { text: string; lang: Lang; isFallback: boolean } | null {
  if (!value) return null
  const ar = value.ar?.trim()
  const en = value.en?.trim()
  // Whichever side is asked for wins; if it is empty the other side is shown
  // rather than nothing. An imported CV often has a Latin-only skill like
  // "React" with no Arabic — that must not render as an empty pill.
  if (lang === 'en') {
    if (en) return { text: en, lang: 'en', isFallback: false }
    if (ar) return { text: ar, lang: 'ar', isFallback: true }
    return null
  }
  if (ar) return { text: ar, lang: 'ar', isFallback: false }
  if (en) return { text: en, lang: 'en', isFallback: true }
  return null
}

/** Convenience for places that only need the string (returns '' when absent). */
export function text(value: LocalizedText | undefined, lang: Lang): string {
  return resolveField(value, lang)?.text ?? ''
}

/* ── Numerals ──────────────────────────────────────────────────────────────
   Arabic-Indic (٠١٢٣) in Arabic, Western in English. Done with Intl, never by
   substituting characters in the source data.
   ────────────────────────────────────────────────────────────────────────── */

const LOCALE: Record<Lang, string> = {
  ar: 'ar-JO-u-nu-arab',
  en: 'en-US',
}

export function formatNumber(
  n: number,
  lang: Lang,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(LOCALE[lang], options).format(n)
}

/** GPA prints with one decimal: ٣٫٤ in Arabic, 3.4 in English. */
export function formatGpa(gpa: number, lang: Lang): string {
  return formatNumber(gpa, lang, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

export function formatYear(year: number, lang: Lang): string {
  return formatNumber(year, lang, { useGrouping: false })
}

/* ── Dates from a CV ───────────────────────────────────────────────────────
   Stored as the student wrote them ("Dec 2025", "2018", "present"). Rendered
   with Levantine month names and Arabic-Indic digits in Arabic; untouched
   otherwise, so an unusual format still shows rather than vanishing.
   ────────────────────────────────────────────────────────────────────────── */

const MONTHS_AR = [
  'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
  'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول',
]
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(value: string | undefined, lang: Lang): string {
  if (!value) return ''
  const v = value.trim()
  if (/^(present|current|now|ongoing|today|حاليا|حالياً|الان|الآن|حتى الان|حتى الآن)$/i.test(v)) {
    return lang === 'ar' ? 'حتى الآن' : 'Present'
  }
  const m = v.match(/^(?:([a-z]+)\.?\s+)?((?:19|20)\d{2})$/i)
  if (!m) return v
  const year = formatYear(parseInt(m[2], 10), lang)
  if (!m[1]) return year
  const idx = MONTHS_EN.findIndex((mo) => m[1].toLowerCase().startsWith(mo.toLowerCase()))
  if (idx < 0) return v
  return lang === 'ar' ? `${MONTHS_AR[idx]} ${year}` : `${MONTHS_EN[idx]} ${year}`
}

/** "Dec 2025 – Present" / «كانون الأول ٢٠٢٥ – حتى الآن». */
export function formatRange(from: string | undefined, to: string | undefined, lang: Lang): string {
  const a = formatDate(from, lang)
  const b = formatDate(to, lang)
  if (!a && !b) return ''
  if (!b || a === b) return a || b
  return `${a} – ${b}`
}

/* ── UI strings ────────────────────────────────────────────────────────────
   Colloquial, warm, second person. Never form-speak: no «يرجى إدخال»,
   no «حقل مطلوب», no «خطأ».
   ────────────────────────────────────────────────────────────────────────── */

export const ui = {
  // Sections
  projects: { ar: 'مشاريعي', en: 'Projects' },
  volunteering: { ar: 'تطوّع وقيادة', en: 'Volunteering & Leadership' },
  activities: { ar: 'نشاطات', en: 'Activities' },
  experience: { ar: 'خبرة عملية', en: 'Experience' },
  education: { ar: 'الدراسة', en: 'Education' },
  skills: { ar: 'مهارات', en: 'Skills' },
  links: { ar: 'تواصل', en: 'Contact' },

  // Skill groups (shown only when a page has more than one)
  technical: { ar: 'تقنية', en: 'Technical' },
  language: { ar: 'لغات', en: 'Languages' },
  soft: { ar: 'شخصية', en: 'Soft skills' },

  // Badges
  courseProject: { ar: 'مشروع مساق', en: 'Course project' },
  personalProject: { ar: 'مشروع شخصي', en: 'Personal project' },
  teamProject: { ar: 'مشروع جماعي', en: 'Team project' },

  // Chrome
  toggleLang: { ar: 'English', en: 'العربية' },
  toggleTheme: { ar: 'تبديل الوضع', en: 'Toggle theme' },
  report: { ar: 'الإبلاغ عن هذه الصفحة', en: 'Report this page' },
  builtWith: { ar: 'مبني بنُقوش', en: 'Built with Nuqush' },
  start: { ar: 'ابدأ بلا حساب', en: 'Start, no account' },
} as const satisfies Record<string, LocalizedText>

export type UiKey = keyof typeof ui

export function t(key: UiKey, lang: Lang): string {
  return text(ui[key], lang)
}
