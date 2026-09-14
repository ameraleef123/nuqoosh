/**
 * Handles. Every profile has two, both permanent:
 *   - the Arabic handle, which is the name the student is proud of;
 *   - a Latin twin, because chat apps percent-encode Arabic URLs when they are
 *     copied and a recruiter would see a wall of %D9%85.
 *
 * The Latin twin is transliterated from the Arabic name when no Latin name was
 * given. This is a readable romanisation, not a standard: «ليان الشوابكة»
 * becomes `lyan-alshwabka`, which is a fine URL and which the student can edit
 * in the wizard.
 */

const MAP: Record<string, string> = {
  ا: 'a', أ: 'a', إ: 'i', آ: 'a', ٱ: 'a',
  ب: 'b', ت: 't', ث: 'th', ج: 'j', ح: 'h', خ: 'kh',
  د: 'd', ذ: 'th', ر: 'r', ز: 'z', س: 's', ش: 'sh',
  ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: 'a', غ: 'gh',
  ف: 'f', ق: 'q', ك: 'k', ل: 'l', م: 'm', ن: 'n',
  ه: 'h', و: 'w', ي: 'y', ى: 'a', ة: 'a',
  ء: '', ؤ: 'o', ئ: 'e',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
}

export function transliterate(arabic: string): string {
  let out = ''
  for (const ch of arabic.replace(/[ً-ْـ]/g, '')) out += MAP[ch] ?? (/[a-z0-9]/i.test(ch) ? ch : ' ')
  return out
}

/** A URL-safe Latin handle: lowercase, hyphens, 2–40 chars. */
export function toLatinHandle(name: string): string {
  const base = (/[؀-ۿ]/.test(name) ? transliterate(name) : name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '')
  // Two characters is the schema's floor; a one-letter name gets a suffix.
  return base.length >= 2 ? base : `${base || 'me'}-${Math.random().toString(36).slice(2, 6)}`
}

/** The Arabic handle keeps the letters; spaces become hyphens. */
export function toArabicHandle(name: string): string {
  return name.trim().replace(/[ً-ْـ]/g, '').replace(/\s+/g, '-')
}
