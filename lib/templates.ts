import type { SectionOrderVariant } from './profile'

/**
 * Templates are DATA plus component variants, not 28 forks.
 *
 * A template is a real identity, never a recolour: it picks its own background
 * system, glass intensity, palette, type pair, motion signature, hero layout,
 * project-card shape and section order. The palette lives in `app/templates.css`
 * (three blocks per template so JS-off theming still works); everything that
 * drives component choice lives here.
 *
 * Every contrast pair for the built templates is measured — see the Phase 2
 * block in scripts/contrast.py.
 */

export type TemplateBackground = 'frost' | 'prism' | 'dawn' | 'ink'
export type TemplateMotion = 'crisp' | 'drift' | 'rise' | 'editorial'
export type HeroLayout = 'centered' | 'split' | 'stacked' | 'editorial' | 'feature'
export type ProjectCardShape = 'panel' | 'tile' | 'list' | 'ledger'
export type GlassIntensity = 'subtle' | 'default' | 'strong'

/** How the sections below the hero are arranged. */
export type SectionLayout = 'stack' | 'bento'

/**
 * Optional Lottie art, self-hosted under public/lottie.
 * Every slot is lazy and reduced-motion aware — see components/lottie-mark.tsx.
 */
export type TemplateMedia = {
  /** Fixed backdrop behind the whole screen, under every card. */
  background?: string
  /** Art inside the hero card itself. */
  hero?: string
  /** A quiet mark in the page corner. */
  corner?: string
}

export type Template = {
  id: string
  /** Arabic mood name. The student picks a feeling, never "Layout 3". */
  name: string
  /** One line, in the student's own words, describing how it should feel. */
  mood: string
  lean: 'light' | 'dark'
  free: boolean
  built: boolean

  background: TemplateBackground
  glass: GlassIntensity
  motion: TemplateMotion
  hero: HeroLayout
  card: ProjectCardShape
  order: SectionOrderVariant
  layout: SectionLayout
  media?: TemplateMedia

  /** Display / body font CSS variables, applied by app/templates.css. */
  fonts: { display: string; body: string }
}

/* ── Built in Phase 2 ────────────────────────────────────────────────────── */

export const TEMPLATES: Template[] = [
  {
    id: 'saqee',
    name: 'صقيع',
    mood: 'برد نظيف وواضح، بلا زحمة',
    lean: 'light',
    free: true,
    built: true,
    background: 'frost',
    glass: 'strong',
    motion: 'crisp',
    hero: 'feature',
    card: 'panel',
    order: 'A',
    layout: 'bento',
    media: {
      background: '/lottie/frost-hero.lottie',
      hero: '/lottie/frost-card.lottie',
      // corner: pending an exported file — the LottieFiles editor link cannot be
      // fetched without an account, so the slot is wired but empty.
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'ballour',
    name: 'بلّور',
    mood: 'لمعان متعدّد الألوان، فيه حياة',
    lean: 'light',
    free: true,
    built: true,
    background: 'prism',
    glass: 'default',
    motion: 'drift',
    hero: 'split',
    card: 'tile',
    order: 'A',
    layout: 'stack',
    media: {
      // The one free-catalog Lottie that met the bar: a vector prism splitting
      // light, 1.6 KB. Everything else for this template is CSS.
      hero: '/lottie/prism.lottie',
    },
    fonts: { display: 'almarai', body: 'plex-arabic' },
  },
  {
    id: 'fajr',
    name: 'فجر',
    mood: 'أوّل ضوء، من العتمة للدفا',
    lean: 'dark',
    free: true,
    built: true,
    background: 'dawn',
    glass: 'strong',
    motion: 'rise',
    hero: 'stacked',
    card: 'panel',
    order: 'A',
    layout: 'stack',
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'hibr',
    name: 'حبر',
    mood: 'حبر أسود على ورق، كلامك هو البطل',
    lean: 'dark',
    free: true,
    built: true,
    background: 'ink',
    glass: 'default',
    motion: 'editorial',
    hero: 'editorial',
    card: 'list',
    order: 'A',
    layout: 'stack',
    fonts: { display: 'naskh', body: 'plex-arabic' },
  },
]

/* ── The remaining 24 identities (Phase 5) ───────────────────────────────────
   Listed so the gallery shows the full range of moods honestly, each marked as
   not yet built. Full identity sheets live in design-system/nuqush/templates.md.
   ────────────────────────────────────────────────────────────────────────── */

export type PlannedTemplate = { id: string; name: string; mood: string; lean: 'light' | 'dark'; free: boolean }

export const PLANNED: PlannedTemplate[] = [
  { id: 'nada', name: 'ندى', mood: 'نقاط صباح خضراء', lean: 'light', free: false },
  { id: 'sarab', name: 'سراب', mood: 'حرارة رمل بعيد', lean: 'light', free: false },
  { id: 'waraqa', name: 'ورقة', mood: 'ورق وحبر، بلا ضجيج', lean: 'light', free: true },
  { id: 'hams', name: 'همس', mood: 'هادئ لدرجة الهمس', lean: 'light', free: false },
  { id: 'shafaq', name: 'شفق', mood: 'آخر ضوء بنفسجي', lean: 'dark', free: false },
  { id: 'ghasaq', name: 'غسق', mood: 'جمر تحت رماد', lean: 'dark', free: false },
  { id: 'rathath', name: 'رذاذ', mood: 'مطر خفيف على زجاج', lean: 'light', free: false },
  { id: 'dabab', name: 'ضباب', mood: 'طبقات بيضاء ناعمة', lean: 'light', free: false },
  { id: 'zabad', name: 'زبد', mood: 'رغوة بحر', lean: 'light', free: false },
  { id: 'lulu', name: 'لؤلؤ', mood: 'لمعة صدفة', lean: 'light', free: false },
  { id: 'aqeeq', name: 'عقيق', mood: 'حجر أحمر بخطوط ذهب', lean: 'dark', free: false },
  { id: 'fayrouz', name: 'فيروز', mood: 'لون البتراء والبحر', lean: 'light', free: false },
  { id: 'yaqout', name: 'ياقوت', mood: 'أحمر عميق فخم', lean: 'dark', free: false },
  { id: 'kahraman', name: 'كهرمان', mood: 'دفء ذهبي', lean: 'dark', free: false },
  { id: 'marjan', name: 'مرجان', mood: 'مرح دافئ', lean: 'light', free: false },
  { id: 'naseem', name: 'نسيم', mood: 'هواء وفراغ', lean: 'light', free: true },
  { id: 'zilal', name: 'ظلال', mood: 'رمادي هادئ، بلا لون', lean: 'dark', free: false },
  { id: 'wameed', name: 'وميض', mood: 'ومضة سماوية', lean: 'dark', free: false },
  { id: 'sadeem', name: 'سديم', mood: 'فضاء بعيد', lean: 'dark', free: false },
  { id: 'bareeq', name: 'بريق', mood: 'غبار ذهب على عاج', lean: 'light', free: false },
  { id: 'raml', name: 'رمل', mood: 'كثبان دافئة', lean: 'light', free: false },
  { id: 'sahab', name: 'سحاب', mood: 'غيم أبيض على أزرق', lean: 'light', free: false },
  { id: 'sada', name: 'صدى', mood: 'حلقات حبر متّسعة', lean: 'light', free: false },
  { id: 'thalj', name: 'ثلج', mood: 'أبيض ناصع بظلّ أزرق', lean: 'light', free: false },
]

export const TOTAL_TEMPLATES = TEMPLATES.length + PLANNED.length // 28

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
