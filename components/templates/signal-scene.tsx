/**
 * مَدى — the country the signal reaches, second pass. Drawn.
 *
 * The first page was a scan grid with four rings and a strip of horizon, and
 * the owner called it basic. Range is a distance, and a distance needs a
 * landscape to be measured across: so the page is now a night country seen
 * from the mast — a sky of stars with a satellite crossing it, three ridges
 * of mountains fading with distance, the lights of towns in the valleys, and
 * over all of it the SIGNAL: range rings opening from the lamp, a radar sweep
 * turning from the same point, and radio waves running across the sky.
 *
 * SVG and CSS; transform and opacity only.
 */

function hash(n: number) {
  return (n * 2654435761) % 1000
}

const W = 1440
const H = 900

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: (i * W) / 90 + (hash(i * 7 + 1) / 1000) * 16,
  y: 8 + (hash(i * 13 + 5) / 1000) * 440,
  r: 0.6 + (hash(i * 3 + 2) / 1000) * 1.1,
  twinkle: i % 7 === 3 ? (i % 3) + 1 : undefined,
}))

/** A ridge: a smoothed run of peaks. `base` is the valley line, `amp` the
 *  tallest peak, `seed` decides the shape. */
function ridge(base: number, amp: number, seed: number, n: number) {
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const x = (i * W) / n
    const y = base - (hash(seed * 31 + i * 17) / 1000) * amp - (i % 2 === 0 ? amp * 0.25 : 0)
    pts.push(`${x.toFixed(0)} ${y.toFixed(0)}`)
  }
  return `M-40 ${H} L-40 ${base} L ${pts.join(' L ')} L ${W + 40} ${base} L ${W + 40} ${H} Z`
}

const TOWNS: readonly (readonly [number, number, number, number])[] = [
  // [x, y, count, spread]
  [140, 742, 6, 60],
  [330, 758, 3, 22],
  [520, 748, 9, 90],
  [720, 764, 4, 30],
  [900, 746, 7, 70],
  [1080, 760, 3, 20],
  [1240, 750, 10, 100],
  [1400, 762, 4, 30],
]
const LIGHTS = TOWNS.flatMap(([x, y, n, spread], t) =>
  Array.from({ length: n }, (_, i) => ({
    x: x + (i - (n - 1) / 2) * (spread / Math.max(n - 1, 1)) + (hash(t * 31 + i * 7) / 1000) * 6 - 3,
    y: y - (hash(t * 17 + i * 11) / 1000) * 6,
    r: 1 + (hash(t * 13 + i * 3) / 1000) * 1.3,
    blink: (t + i) % 5 === 0 ? ((t + i) % 3) + 1 : undefined,
  }))
)

/** Radio waves: sine runs across the sky, three of them, drawn over two
 *  periods so a one-period slide loops without a seam. */
function wave(y: number, amp: number, period: number) {
  let d = `M-${period} ${y}`
  for (let x = -period; x <= W + period; x += period / 2) {
    const cx = x + period / 4
    const up = ((x + period) / (period / 2)) % 2 === 0
    d += ` Q ${cx} ${y + (up ? -amp : amp)} ${x + period / 2} ${y}`
  }
  return d
}

export function SignalScene() {
  return (
    <>
      {/* The range and the sweep, from the lamp's corner: CSS layers, so the
          sweep can be a conic gradient and the rings can be viewport-sized. */}
      <div className="signal-origin" aria-hidden="true">
        <span className="signal-sweep" />
        <span className="signal-ring" data-ring="1" />
        <span className="signal-ring" data-ring="2" />
        <span className="signal-ring" data-ring="3" />
        <span className="signal-ring" data-ring="4" />
      </div>

      <svg className="signal-scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="signal-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="signal-glow-a" />
            <stop offset="1" className="signal-glow-b" />
          </linearGradient>
        </defs>

        {/* Stars, and the satellite crossing them. */}
        <g className="signal-stars">
          {STARS.map((s, i) => (
            <circle key={i} className="signal-star" data-twinkle={s.twinkle} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(1)} />
          ))}
        </g>
        <g className="signal-sat">
          <rect className="signal-sat-panel" x="-14" y="-2" width="10" height="4" />
          <rect className="signal-sat-panel" x="4" y="-2" width="10" height="4" />
          <rect className="signal-sat-body" x="-3" y="-3" width="6" height="6" />
          <circle className="signal-sat-light" cx="0" cy="0" r="1.6" />
        </g>

        {/* Radio waves across the sky. */}
        <g className="signal-waves">
          <path className="signal-wave" data-wave="1" d={wave(300, 14, 360)} />
          <path className="signal-wave" data-wave="2" d={wave(380, 10, 260)} />
          <path className="signal-wave" data-wave="3" d={wave(450, 18, 480)} />
        </g>

        {/* The glow of the towns on the haze above the ridges. */}
        <rect className="signal-haze" x="0" y="560" width={W} height="220" fill="url(#signal-glow)" />

        {/* Three ridges, fading with distance. */}
        <path className="signal-ridge" data-depth="3" d={ridge(700, 150, 3, 14)} />
        <path className="signal-ridge" data-depth="2" d={ridge(740, 120, 7, 18)} />
        <g className="signal-towns">
          {LIGHTS.map((l, i) => (
            <circle key={i} className="signal-light" data-blink={l.blink} cx={l.x.toFixed(1)} cy={l.y.toFixed(1)} r={l.r.toFixed(1)} />
          ))}
          {/* Two far masts of other stations, lamps lit. */}
          <path className="signal-far-mast" d="M520 748 V 700 M1240 750 V 696" />
          <circle className="signal-light" data-blink="2" cx="520" cy="698" r="1.8" />
          <circle className="signal-light" data-blink="3" cx="1240" cy="694" r="1.8" />
        </g>
        <path className="signal-ridge" data-depth="1" d={ridge(800, 90, 11, 22)} />
      </svg>
    </>
  )
}
