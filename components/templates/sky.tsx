/**
 * The نسيم sky — drawn, because a breeze is only visible in what it moves.
 *
 * The first two builds of this template were an ABSENCE: a pale wash with a
 * gutter, then a gradient with three radial-gradient smudges that read as
 * nothing at all. Both failed the test سِيق and مُحيط pass — a place with a
 * body that the person stands inside. This is the third build, and it is a
 * place: an open sky over hazy hills, with a sun (a moon at night), cumulus
 * clouds crossing it, a small flock going the other way, and stars after dark.
 *
 * Everything here is SVG and CSS. Nothing is fetched, and everything that
 * moves does so on `transform` or `opacity` — the compositor's work, after
 * ساكورا's stutter taught what a tiled Lottie backdrop costs.
 *
 * Which parts show is decided by the theme's tokens (`--sky-sun`, `--sky-moon`,
 * `--sky-stars`, `--sky-birds`), so the same markup serves day and night and
 * the switch is a repaint, not a re-render.
 */

/** Deterministic, so the night sky is identical on the server and the client.
 *  `Math.random()` here would be a hydration mismatch on every load. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

const STARS = Array.from({ length: 44 }, (_, i) => {
  // Stratified: one star per column slot, jittered inside it, so they never
  // fall into a row (a single multiplicative hash produced a fence in نيويورك).
  const col = i % 11
  const row = Math.floor(i / 11)
  const x = (col * 1000) / 11 + (hash(i * 7 + 1) * 1000) / 11 / 1000
  const y = (row * 520) / 4 + (hash(i * 13 + 5) * 520) / 4 / 1000
  const r = 0.8 + hash(i * 3 + 2) / 1000
  return { x: Math.round(x), y: Math.round(y), r: Math.round(r * 10) / 10, twinkle: i % 6 === 2 ? (i % 3) + 1 : undefined }
})

/** One cumulus: a flat base and a few domes. Overlaps do not show because the
 *  SVG's own opacity composites the group as one shape. */
function Cloud({ n }: { n: 1 | 2 | 3 | 4 }) {
  return (
    <svg className="sky-cloud" data-cloud={n} viewBox="0 0 240 100" aria-hidden="true" focusable="false">
      <rect x="18" y="56" width="204" height="34" rx="17" />
      <circle cx="62" cy="58" r="28" />
      <circle cx="104" cy="44" r="36" />
      <circle cx="150" cy="50" r="32" />
      <circle cx="190" cy="60" r="24" />
    </svg>
  )
}

export function BreezeSky() {
  return (
    <>
      {/* Day: the sun, high in the far corner, mostly halo. */}
      <span className="sky-sun" />
      {/* Night: a moon in the same corner, and stars above the hills. */}
      <span className="sky-moon" />
      <svg className="sky-stars" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
        {STARS.map((s, i) => (
          <circle key={i} className="sky-star" data-twinkle={s.twinkle} cx={s.x} cy={s.y} r={s.r} />
        ))}
      </svg>

      <Cloud n={1} />
      <Cloud n={2} />
      <Cloud n={3} />
      <Cloud n={4} />

      {/* A small flock, going the other way from the clouds: two directions of
          movement are what make a sky read as air rather than as a slideshow. */}
      <svg className="sky-birds" viewBox="0 0 120 40" aria-hidden="true" focusable="false">
        <path d="M4 18 q4 -5 8 0 q4 -5 8 0" />
        <path d="M30 10 q4 -5 8 0 q4 -5 8 0" />
        <path d="M46 24 q3 -4 6 0 q3 -4 6 0" />
        <path d="M70 14 q4 -5 8 0 q4 -5 8 0" />
        <path d="M96 22 q3 -4 6 0 q3 -4 6 0" />
      </svg>

      {/* Hazy hills at the foot of the viewport: the ground a kite is flown
          from. Two ridges, the far one paler, which is how distance reads. */}
      <svg className="sky-hills" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          className="sky-hill-far"
          d="M0 150 C 140 96, 260 128, 400 104 C 540 80, 640 122, 780 108 C 920 94, 1010 60, 1160 84 C 1290 104, 1360 88, 1440 96 V220 H0 Z"
        />
        <path
          className="sky-hill-near"
          d="M0 200 C 120 160, 300 176, 460 160 C 620 144, 720 178, 900 164 C 1080 150, 1200 128, 1440 156 V220 H0 Z"
        />
      </svg>
    </>
  )
}
