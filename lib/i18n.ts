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
  if (lang === 'en') {
    const en = value.en?.trim()
    if (en) return { text: en, lang: 'en', isFallback: false }
    const ar = value.ar?.trim()
    if (!ar) return null
    return { text: ar, lang: 'ar', isFallback: true }
  }
  const ar = value.ar?.trim()
  if (!ar) return null
  return { text: ar, lang: 'ar', isFallback: false }
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
