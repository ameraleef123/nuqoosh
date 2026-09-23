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

export type TemplateBackground = 'frost' | 'prism' | 'dawn' | 'ink' | 'paper' | 'sprout' | 'night' | 'air' | 'stone' | 'grid' | 'deep' | 'shade' | 'spark'
export type TemplateMotion = 'crisp' | 'drift' | 'rise' | 'editorial' | 'glow' | 'soft'
export type HeroLayout = 'centered' | 'split' | 'stacked' | 'editorial' | 'feature' | 'cover' | 'orbit' | 'ribbon' | 'gate' | 'blocks' | 'porthole' | 'sunlit' | 'breakout'
export type ProjectCardShape = 'panel' | 'tile' | 'list' | 'ledger' | 'branch' | 'lume' | 'float' | 'carved' | 'block' | 'pebble' | 'cast' | 'ember'
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
  {
    id: 'rafif',
    name: 'رَفيف',
    mood: 'رفّة هوا خفيفة، وكل شي فيه مساحة',
    lean: 'light',
    free: true,
    built: true,
    // رَفيف is the word for the faint quiver of something light in moving air:
    // a leaf, a wing, the surface of water. It is the quietest template in the
    // set and the one with the most empty space — the argument being that a
    // page with four things on it should look deliberate, not unfinished.
    //
    // It completes the motion signatures: soft is the sixth and last, and the
    // only one that changes the easing rather than the duration. Nothing here
    // snaps.
    background: 'air',
    glass: 'subtle',
    motion: 'soft',
    hero: 'ribbon',
    card: 'float',
    order: 'B',
    layout: 'stack',
    media: {
      // Bundles of fine lines drifting across the viewport at three different
      // heights — moving air, drawn. 8 KB.
      background: '/lottie/air-lines.lottie',
      // A band of contour lines crossing the whole hero, edge to edge: the
      // only thing on the page that moves near the text. Pure strokes, no
      // fills, so it tints and inverts cleanly.
      hero: '/lottie/air-current.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'siq',
    name: 'سِيق',
    mood: 'ممرّ محفور بالصخر، وآخره ضوء',
    lean: 'dark',
    free: true,
    built: true,
    // السِّيق is the narrow canyon you walk before the Treasury appears: rose
    // rock on both sides and a slot of light at the end. For a student it is
    // the passage rather than the arrival, which is the honest place to be.
    //
    // It is the bold one. Eight templates in, everything in the set was calm,
    // crafted or quiet, and a student who wants their page to feel strong had
    // no option. It is also the first to use the brand's own Petra rose as its
    // primary, and the first whose surfaces are cut INTO the ground rather
    // than laid on it.
    background: 'stone',
    glass: 'strong',
    motion: 'crisp',
    hero: 'gate',
    card: 'carved',
    order: 'C',
    layout: 'stack',
    media: {
      // The canyon itself: red walls, a gap of sky, birds crossing it. One
      // wide scene fixed to the viewport, under every card. 10 KB.
      background: '/lottie/canyon.lottie',
      backgroundFit: 'cover',
      // The hero mark: a carved gate drawn in rose line, with light fanning
      // out behind it. 4.6 KB, and already the template's own colour.
      hero: '/lottie/gate-sun.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'takwin',
    name: 'تَكوين',
    mood: 'أشكال بسيطة، مرتّبة بقصد',
    lean: 'light',
    free: true,
    built: true,
    // تَكوين is the word an Arabic art school uses for a composition: the
    // arrangement of simple elements into one deliberate thing. That is
    // literally what a student's first page is — a dozen small pieces placed
    // on purpose — and it is the only template that says so in its layout.
    //
    // It is the graphic one. Nine templates in, everything was atmospheric:
    // weather, paper, sky, rock, air. This one has no scene at all, only flat
    // shapes, hard edges, a visible grid and two colours.
    background: 'grid',
    glass: 'default',
    motion: 'crisp',
    hero: 'blocks',
    card: 'block',
    order: 'B',
    layout: 'bento',
    media: {
      // Outlined forms drifting: the same vocabulary as the hero, hollow.
      // 2 KB.
      background: '/lottie/float-forms.lottie',
      // The hero mark: a diamond, a disc, a bar and a half-round stacked into
      // a column — the composition in miniature. 3 KB.
      hero: '/lottie/shape-totem.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'muheet',
    name: 'مُحيط',
    mood: 'قاع هادي، وضوء نازل من فوق',
    lean: 'dark',
    free: true,
    built: true,
    // The owner's own idea, and the first template in the set that is a place
    // rather than a material or a mood: you are under the sea. Light comes
    // down from a surface you cannot see, a shoal crosses the middle water,
    // and a wreck has been settling on the bottom for a long time.
    //
    // For a student, the reading is the one the page is for: what is down
    // here is quiet and unfinished, and the light still reaches it.
    background: 'deep',
    glass: 'default',
    motion: 'drift',
    hero: 'porthole',
    card: 'pebble',
    order: 'C',
    layout: 'stack',
    media: {
      // A shoal crossing the middle water, tiled at three depths. 9 KB.
      background: '/lottie/shoal.lottie',
      // The hero: a jellyfish drifting behind the porthole glass. 20 KB, and
      // the only thing in the template with colour of its own.
      hero: '/lottie/jellyfish.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'fayi',
    name: 'فَيء',
    mood: 'ضوء بعد الظهر، وظلّ بيطوّل',
    lean: 'light',
    free: true,
    built: true,
    // فَيء is not any shade: it is the shadow that comes back in the afternoon
    // and lengthens as the day goes. The word exists because that shade is a
    // different thing from the morning's.
    //
    // It is the one template with no colour to speak of. Every other page in
    // the set is built on a hue; this one is built on a light SOURCE. There is
    // a lit side and a shaded side, every surface throws a long shadow away
    // from the same sun, and the only chromatic note is the violet that real
    // shadows take late in the day.
    background: 'shade',
    glass: 'default',
    motion: 'soft',
    hero: 'sunlit',
    card: 'cast',
    order: 'B',
    layout: 'stack',
    media: {
      // Leaf shadows drifting down the wall. Tinted to the shade colour, never
      // to green: what reaches this wall is the shadow, not the leaf. 26 KB.
      background: '/lottie/drift-leaves.lottie',
      // The frond doing the casting, in the shaded half of the hero — and it
      // throws a real drop-shadow of its own silhouette. 14 KB.
      hero: '/lottie/frond.lottie',
    },
    fonts: { display: 'cairo', body: 'plex-arabic' },
  },
  {
    id: 'himma',
    name: 'هِمّة',
    mood: 'اندفاع، وشغف ما بستنى إذن',
    lean: 'light',
    free: true,
    built: true,
    // هِمّة is the word Arabs use about a young person with drive: زeal, high
    // aspiration, the thing someone has before they have a record. It is the
    // most on-message name in the set, because it is exactly what a student
    // with no experience brings.
    //
    // Twelve templates in, the whole set was elegant, atmospheric, crafted or
    // quiet. Nothing in it was LOUD. This is the loud one: a saturated crimson
    // on warm white, an amber stamp, and a hero whose art refuses to stay
    // inside the card.
    background: 'spark',
    glass: 'default',
    motion: 'rise',
    hero: 'breakout',
    card: 'ember',
    order: 'A',
    layout: 'bento',
    media: {
      // Embers drifting up the page, tinted to the crimson. 3 KB.
      background: '/lottie/embers.lottie',
      // The hero mark: a starburst that throws itself open and pulls back in,
      // over and over. It is the one thing on the page that breaks the card's
      // edge, and it is already the template's own crimson. 3 KB.
      hero: '/lottie/burst-star.lottie',
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
