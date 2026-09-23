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

export type TemplateBackground = 'frost' | 'prism' | 'dawn' | 'ink' | 'paper' | 'sprout' | 'night'
export type TemplateMotion = 'crisp' | 'drift' | 'rise' | 'editorial' | 'glow'
export type HeroLayout = 'centered' | 'split' | 'stacked' | 'editorial' | 'feature' | 'cover' | 'orbit'
export type ProjectCardShape = 'panel' | 'tile' | 'list' | 'ledger' | 'branch' | 'lume'
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
  /** 'tile' repeats a small loop across the width (snow); 'cover' fills the
   *  viewport with one wide scene; 'band' anchors one wide strip to the foot
   *  of the viewport, so the page grows out of it. Defaults to tile. */
  backgroundFit?: 'tile' | 'cover' | 'band' 
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

/* ── Built in Phase 2 (+ ورقة, the first of Phase 5) ───────────────────── */

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
    layout: 'stack',
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
    hero: 'cover',
    card: 'panel',
    order: 'A',
    layout: 'stack',
    media: {
      // The painted dusk range is the whole page: one wide scene, fixed to the
      // viewport, under every card. Cards are glass-strong, and text on them
      // measures 8.31:1 / 5.29:1 (dark fg / muted) over the scene's real
      // brightest coral pixel at full opacity.
      background: '/lottie/dawn-scene.lottie',
      backgroundFit: 'cover',
      // The hero character: a flock in silhouette, sweeping the cover strip.
      hero: '/lottie/dawn-birds.lottie',
    },
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
    media: {
      // A quill writing on a scroll — ink on paper, in motion. It sits on a
      // cream paper disc in both themes: a sheet on a dark desk is a natural
      // image, and it keeps the navy feather readable on ink black.
      hero: '/lottie/ink-quill.lottie',
    },
    fonts: { display: 'naskh', body: 'plex-arabic' },
  },
  {
    id: 'waraqa',
    name: 'ورقة',
    mood: 'ورق وحبر، بلا ضجيج',
    lean: 'light',
    free: true,
    built: true,
    // Sheets of warm paper laid on a kraft desk. The signature is tactile
    // rather than luminous: grain, fold creases, a notebook-ruled letterhead
    // with a terracotta margin, ledger rows for the projects, and a real
    // drop shadow under every sheet so it lifts off the desk.
    background: 'paper',
    glass: 'subtle',
    motion: 'editorial',
    hero: 'centered',
    card: 'ledger',
    order: 'B',
    layout: 'stack',
    media: {
      // Paper planes gliding behind the sheets, tiled across the viewport the
      // way صقيع tiles its snow. 2 KB of line art, so it tints to the page's
      // own ink with one static filter and inverts cleanly on black paper.
      background: '/lottie/paper-plane.lottie',
      // The hero mark: a sheet folding itself into a crane. 2.6 KB, drawn in
      // outline only — the one animation in the free catalogue that is made of
      // paper rather than a picture of it.
      hero: '/lottie/paper-crane.lottie',
    },
    fonts: { display: 'naskh', body: 'plex-arabic' },
  },
  {
    id: 'badira',
    name: 'بادِرة',
    mood: 'أوّل خضرة تطلع، وأنت لسّا بالبداية',
    lean: 'light',
    free: true,
    built: true,
    // The name carries the whole argument of this product: بادِرة is both the
    // seedling that first breaks the soil AND the first sign a person shows of
    // what they will become. A student with no job has exactly that to show.
    //
    // It is also the first template that is green, the first laid out as a
    // bento rather than a stack, the first to lead with skills (order C), and
    // the first whose backdrop is anchored to the foot of the screen instead
    // of tiled or covering — so it shares no silhouette with the other five.
    background: 'sprout',
    glass: 'default',
    motion: 'rise',
    hero: 'stacked',
    card: 'branch',
    order: 'C',
    layout: 'bento',
    media: {
      // A field growing along the bottom edge of the viewport, under every
      // card: the page rises out of it. 7 KB.
      background: '/lottie/wheat-field.lottie',
      backgroundFit: 'band',
      // The hero mark: a hand, open, with a seedling breaking out of it. Line
      // art, 3 KB, so it takes the page's own ink in either theme.
      hero: '/lottie/sprout-hand.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'thurayya',
    name: 'ثُرَيّا',
    mood: 'نجوم صغيرة كثيرة، ومع بعضها بتضوّي',
    lean: 'dark',
    free: true,
    built: true,
    // الثريّا is the Pleiades: a cluster of small stars that are faint alone
    // and unmistakable together. It is also the word for a chandelier. For a
    // student whose CV is a dozen small things and no single big one, that is
    // the argument, and it is the second half of what بادِرة says.
    //
    // It is the first template of the seven that is dark AND vivid — فجر is
    // dark and warm, حبر is dark and silent — and the first to use the glow
    // motion signature, an orbit hero and lume cards.
    background: 'night',
    glass: 'default',
    motion: 'glow',
    hero: 'orbit',
    card: 'lume',
    order: 'A',
    layout: 'stack',
    media: {
      // A sky of small stars with one crescent, transparent, so it takes the
      // page's own night rather than bringing its own black. 5 KB.
      background: '/lottie/star-field.lottie',
      // The hero: concentric orbits with a bright point on each. The avatar
      // sits at the centre of them — the student's own chart. 1.2 KB.
      hero: '/lottie/orbit-rings.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
]

/* ── The remaining 23 identities (Phase 5) ───────────────────────────────────
   Listed so the gallery shows the full range of moods honestly, each marked as
   not yet built. Full identity sheets live in design-system/nuqush/templates.md.
   ────────────────────────────────────────────────────────────────────────── */

export type PlannedTemplate = { id: string; name: string; mood: string; lean: 'light' | 'dark'; free: boolean }

export const PLANNED: PlannedTemplate[] = [
  { id: 'nada', name: 'ندى', mood: 'نقاط صباح خضراء', lean: 'light', free: false },
  { id: 'sarab', name: 'سراب', mood: 'حرارة رمل بعيد', lean: 'light', free: false },
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
