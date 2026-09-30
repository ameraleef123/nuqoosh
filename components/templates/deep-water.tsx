/**
 * The مُحيط floor — shafts of surface light, and a wreck resting on the bottom.
 *
 * Drawn, not fetched. The free catalogue's only sunken ship had bitmaps baked
 * into it, and its light-ray animations were worse: a baked sky rectangle that
 * would have painted a hard edge across the page. Both are cheaper here
 * anyway — the shafts are four gradients and the wreck is one SVG path set,
 * so they scale to any viewport, take the page's own colours, and cost nothing
 * to download. Same reasoning as DawnSun.
 *
 * Everything moves on transform or opacity only, inside a reduced-motion
 * guard, and pauses with the rest of the page when the tab is hidden.
 */

/** Deterministic, so the sea is the same on the server and the client. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

const BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  x: 4 + (i * 92) / 10 + (hash(i * 7 + 1) / 1000) * 6,
  size: 5 + Math.round((hash(i * 3 + 2) / 1000) * 9),
  cycle: (i % 5) + 1,
}))
const SNOW = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 100) / 22 + (hash(i * 11 + 3) / 1000) * 4,
  y: (hash(i * 5 + 7) / 1000) * 90,
  cycle: (i % 4) + 1,
}))

/** One kelp frond: a ribbon that narrows toward its tip and waves twice. */
function frond(x: number, h: number, w: number, lean: number) {
  const y0 = 300
  return `M${x - w} ${y0} C ${x - w + lean} ${y0 - h * 0.3}, ${x + w * 0.6 + lean} ${y0 - h * 0.55}, ${x + lean * 0.4} ${y0 - h * 0.8} C ${x + lean * 0.2} ${y0 - h * 0.92}, ${x + lean * 0.6} ${y0 - h * 0.98}, ${x + lean * 0.8} ${y0 - h} C ${x + lean * 0.9} ${y0 - h * 0.95}, ${x + w * 0.9 + lean * 0.4} ${y0 - h * 0.7}, ${x + w * 0.4 + lean * 0.2} ${y0 - h * 0.5} C ${x + w * 1.4} ${y0 - h * 0.28}, ${x + w * 1.2} ${y0 - h * 0.1}, ${x + w} ${y0} Z`
}

const KELP: readonly (readonly [number, number, number, number])[] = [
  [40, 230, 9, 26],
  [78, 170, 7, -18],
  [112, 260, 10, 20],
  [150, 140, 6, -24],
]

function Kelp({ side }: { side: 'start' | 'end' }) {
  return (
    <svg className="deep-kelp" data-side={side} viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      {KELP.map(([x, h, w, lean], i) => (
        <path key={i} className="deep-frond" data-frond={i % 2} data-sway={(i % 3) + 1} d={frond(x, h, w, lean)} style={{ transformOrigin: `${x}px 300px` }} />
      ))}
    </svg>
  )
}

export function DeepWater() {
  return (
    <>
      {/* The surface, at the top of the page: seen from below, a bright wavy
          line with the light of the day pooling under it. Absolute, not fixed
          — you descend away from it as you scroll. */}
      <div className="deep-surface" aria-hidden="true">
        <svg viewBox="0 0 1600 200" preserveAspectRatio="none">
          <g className="deep-wave" data-wave="1">
            <path d="M0 0 H2400 V88 C 2350 66, 2300 66, 2250 88 S 2150 110, 2100 88 S 2000 66, 1950 88 S 1850 110, 1800 88 S 1700 66, 1650 88 S 1550 110, 1500 88 S 1400 66, 1350 88 S 1250 110, 1200 88 S 1100 66, 1050 88 S 950 110, 900 88 S 800 66, 750 88 S 650 110, 600 88 S 500 66, 450 88 S 350 110, 300 88 S 200 66, 150 88 S 50 110, 0 88 Z" />
          </g>
          <g className="deep-wave" data-wave="2">
            <path d="M0 0 H2400 V108 C 2360 92, 2320 92, 2280 108 S 2200 124, 2160 108 S 2080 92, 2040 108 S 1960 124, 1920 108 S 1840 92, 1800 108 S 1720 124, 1680 108 S 1600 92, 1560 108 S 1480 124, 1440 108 S 1360 92, 1320 108 S 1240 124, 1200 108 S 1120 92, 1080 108 S 1000 124, 960 108 S 880 92, 840 108 S 760 124, 720 108 S 640 92, 600 108 S 520 124, 480 108 S 400 92, 360 108 S 280 124, 240 108 S 160 92, 120 108 S 40 124, 0 108 Z" />
          </g>
        </svg>
      </div>

      {/* Marine snow: the slow fall of particles through the column. */}
      {SNOW.map((s, i) => (
        <span key={i} className="deep-snow" data-cycle={s.cycle} style={{ insetInlineStart: `${s.x}%`, insetBlockStart: `${s.y}%` }} />
      ))}

      {/* Bubbles, rising from the bottom. Rings, not discs, so a letter that
          crosses one keeps its ground. */}
      {BUBBLES.map((b, i) => (
        <span key={i} className="deep-bubble" data-cycle={b.cycle} style={{ insetInlineStart: `${b.x}%`, inlineSize: b.size, blockSize: b.size }} />
      ))}

      {/* Kelp, swaying at the foot of the viewport, one bed each side so the
          wreck keeps the middle. */}
      <Kelp side="start" />
      <Kelp side="end" />

      {/* Light coming down from the surface. Four shafts at different widths
          and angles so they read as one diffuse source rather than a pattern. */}
      <div className="deep-shafts" aria-hidden="true">
        <span className="deep-shaft" data-shaft="1" />
        <span className="deep-shaft" data-shaft="2" />
        <span className="deep-shaft" data-shaft="3" />
        <span className="deep-shaft" data-shaft="4" />
      </div>

      <SunkenShip />
    </>
  )
}

/**
 * The wreck: a hull broken at the stern, listing to port, half-settled into
 * the seabed with its mast snapped. It is a silhouette in one colour — detail
 * would be a lie at this depth, where the only thing reaching it is the light
 * from the shafts above.
 */
function SunkenShip() {
  return (
    <svg
      className="deep-wreck"
      viewBox="0 0 900 300"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* The seabed it has settled into. */}
      <path
        className="deep-bed"
        d="M0 246c96-22 168-12 262-18 104-7 168 12 274 6 92-5 150 14 232 4 52-6 96-14 132-22v84H0Z"
      />

      {/* Rocks half-buried in the bed, so the floor is a floor. */}
      <g className="deep-rocks">
        <path d="M96 252c10-18 34-26 58-20 18 5 30 16 34 28H90Z" />
        <path d="M712 246c8-14 26-22 46-18 16 4 28 14 32 26h-84Z" />
        <path d="M790 256c6-9 18-13 30-10 9 2 16 8 18 16h-52Z" />
        <path d="M188 258c5-8 15-11 26-8 8 2 14 7 16 13h-46Z" />
      </g>

      <g className="deep-hull" transform="rotate(-6 450 210)">
        {/* Hull: square stern on the left, raised bow on the right, the whole
            thing sunk into the bed by about a third of its depth. */}
        <path d="M232 176h398c34 0 58 8 70 20-12 26-52 44-114 50l-292 8c-52 1-84-20-90-56 0-14 10-22 28-22Z" />
        {/* The deck line, a shade lighter so the hull does not read as a blob. */}
        <path className="deep-deck" d="M232 176h398c34 0 58 8 70 20H236Z" />
        {/* The break at the stern: a wedge of missing plating. */}
        <path className="deep-gap" d="M288 196l34 42-56-4-14-38Z" />
        {/* A snapped mast, and the spar still hanging off it. */}
        <g className="deep-rig">
          <path d="M452 176 470 62" />
          <path d="M470 84 534 102" />
          <path d="M464 116 402 140" />
        </g>
        {/* Portholes, the one detail that says ship rather than rock. */}
        <g className="deep-ports">
          <circle cx="330" cy="212" r="7" />
          <circle cx="392" cy="214" r="7" />
          <circle cx="454" cy="215" r="7" />
        </g>
      </g>
    </svg>
  )
}
