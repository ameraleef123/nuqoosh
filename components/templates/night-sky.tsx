/**
 * The ثُرَيّا sky — drawn.
 *
 * The first backdrop was a fetched star field that turned out to be a
 * crescent-and-sparkles icon tiled across the top of the page: clip art, not
 * a sky. The word is the Pleiades — the small cluster that is faint star by
 * star and unmistakable together — so the sky is now the real thing: a few
 * hundred stars of varied size, a handful of them breathing; the SEVEN
 * SISTERS in their actual arrangement with the haze of the nebula around
 * them; constellation lines and a graticule, the way an old star chart draws
 * them; a faint band of the Milky Way. By day the same chart is printed in
 * ink on parchment.
 *
 * Everything is SVG/CSS. Only opacity animates (the twinkle). The sky fades
 * out toward the foot of the viewport by the same mask the old field used,
 * and the footer keeps its glass, so text never sits on a bare star.
 */

/** Deterministic, so the server and the client draw the same sky. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

const W = 1440
const H = 900

/** Stratified: one star per cell of a 20x10 grid, jittered, so the sky is
 *  even without being a lattice. Size and brightness vary; every ninth star
 *  is on a twinkle cycle. */
const STARS = Array.from({ length: 200 }, (_, i) => {
  const col = i % 20
  const row = Math.floor(i / 20)
  const x = (col * W) / 20 + (hash(i * 7 + 1) / 1000) * (W / 20)
  const y = (row * H) / 10 + (hash(i * 13 + 5) / 1000) * (H / 10)
  const s = hash(i * 3 + 2) / 1000
  const r = s < 0.7 ? 0.9 : s < 0.92 ? 1.5 : 2.3
  const o = 0.45 + (hash(i * 17 + 9) / 1000) * 0.55
  return { x: Math.round(x), y: Math.round(y), r, o: Math.round(o * 100) / 100, twinkle: i % 9 === 4 ? (i % 3) + 1 : undefined }
})

/** A few star groups joined by hairlines, as a chart would. Indices into STARS. */
const FIGURES: readonly (readonly number[])[] = [
  [2, 23, 44, 45, 66],
  [8, 29, 30, 51],
  [72, 93, 94, 115, 136],
  [117, 138, 159, 158],
  [80, 101, 122],
  [168, 189, 190, 171],
]

/**
 * The Seven Sisters, roughly as they sit in the sky (north up, east left):
 * Alcyone brightest, Atlas and Pleione close together at the east, Electra,
 * Celaeno and Taygeta strung along the west, Maia and Asterope above, Merope
 * below. Units are a 100x80 box.
 */
const SISTERS: readonly (readonly [number, number, number])[] = [
  [60, 50, 3.6], // Alcyone
  [78, 52, 2.6], // Atlas
  [80, 45, 1.8], // Pleione
  [52, 66, 2.4], // Merope
  [30, 54, 2.6], // Electra
  [27, 44, 1.8], // Celaeno
  [30, 35, 2.4], // Taygeta
  [46, 33, 2.6], // Maia
  [48, 25, 1.6], // Asterope
]

export function NightSky() {
  return (
    <>
      {/* A faint band of the Milky Way, low across the sky. */}
      <span className="chart-way" />

      <svg className="chart-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
        {/* The graticule: an ecliptic arc and a few faint meridians. */}
        <g className="chart-grid">
          <path d={`M-80 ${H * 0.62} Q ${W / 2} ${H * 0.22} ${W + 80} ${H * 0.62}`} />
          <path d={`M-80 ${H * 0.86} Q ${W / 2} ${H * 0.46} ${W + 80} ${H * 0.86}`} />
          {[0.18, 0.5, 0.82].map((f) => (
            <path key={f} d={`M${W * f} 0 Q ${W * f + (f - 0.5) * 120} ${H / 2} ${W * f + (f - 0.5) * 60} ${H}`} />
          ))}
        </g>

        {/* Constellation lines. */}
        <g className="chart-lines">
          {FIGURES.map((fig, i) => (
            <polyline key={i} points={fig.map((k) => `${STARS[k].x},${STARS[k].y}`).join(' ')} />
          ))}
        </g>

        {/* The stars. */}
        <g className="chart-stars">
          {STARS.map((s, i) => (
            <circle key={i} className="chart-star" data-twinkle={s.twinkle} cx={s.x} cy={s.y} r={s.r} style={{ opacity: s.o }} />
          ))}
        </g>
      </svg>

      {/* The Pleiades themselves, in the far top corner where nothing is
          written: a haze, then the sisters, each with a soft glow. */}
      <svg className="chart-pleiades" viewBox="0 0 100 80" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="pleiades-haze">
            <stop offset="0" className="chart-haze-a" />
            <stop offset="1" className="chart-haze-b" />
          </radialGradient>
          {/* A sister's glow: bright at the core, gone by the edge — a flat
              disc read as a coin, not a star. */}
          <radialGradient id="sister-glow">
            <stop offset="0" className="chart-glow-a" />
            <stop offset="0.45" className="chart-glow-b" />
            <stop offset="1" className="chart-glow-c" />
          </radialGradient>
        </defs>
        <ellipse cx="54" cy="46" rx="42" ry="30" fill="url(#pleiades-haze)" />
        <g className="chart-sister-lines">
          <polyline points="30,35 46,33 60,50 78,52 80,45" />
          <polyline points="27,44 30,54 52,66 60,50" />
        </g>
        {SISTERS.map(([x, y, r], i) => (
          <g key={i} className="chart-sister" data-twinkle={(i % 3) + 1}>
            <circle className="chart-sister-glow" cx={x} cy={y} r={r * 2.6} fill="url(#sister-glow)" />
            <circle className="chart-sister-core" cx={x} cy={y} r={r} />
          </g>
        ))}
      </svg>
    </>
  )
}
