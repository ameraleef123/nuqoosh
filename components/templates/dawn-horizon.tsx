/**
 * فجر — the horizon, and the whole hero is the scene. Drawn.
 *
 * The second hero split the card in two: a band of sky on top and a plain
 * panel of text under it. The owner did not want halves. Now the horizon
 * fills the card edge to edge: sky above, the sun's rays fanning from the
 * horizon line at the END side, three ridges of hills along the foot with
 * mist in the valleys — and the writing stands in the sky at the START side
 * while the portrait rises on the horizon where the sun would be.
 *
 * The SVG is stretched to the card (`preserveAspectRatio="none"`) so the
 * horizon sits at a fixed 71% of the card's height and the portrait can be
 * placed on it in percentages. In RTL the drawing is mirrored so the sun
 * stays at inline-end. Rays turn on transform, mist breathes on opacity.
 */

const W = 1200
const H = 420
export const HORIZON = 300 // 71.4% of H — the CSS places the portrait here
export const SUN_X = 880 // 73.3% of W — inline-end, mirrored in RTL

function ridge(base: number, pts: readonly (readonly [number, number])[]) {
  return `M-20 ${H} L-20 ${base} ${pts.map(([x, y]) => `L ${x} ${y}`).join(' ')} L ${W + 20} ${base} L ${W + 20} ${H} Z`
}

export function DawnHorizon() {
  return (
    <svg className="dawn-horizon" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="dawn-glow" cx={SUN_X / W} cy={HORIZON / H} r="0.62">
          <stop offset="0" className="dawn-glow-a" />
          <stop offset="0.45" className="dawn-glow-b" />
          <stop offset="1" className="dawn-glow-c" />
        </radialGradient>
        <linearGradient id="dawn-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="dawn-mist-a" />
          <stop offset="1" className="dawn-mist-b" />
        </linearGradient>
      </defs>

      {/* The sun's glow under the horizon, and its rays fanning up from it.
          Coordinates are rounded: server and browser trig differ in the last
          digit, and a path that differs by a digit is a hydration mismatch. */}
      <rect className="dawn-glow-band" x="0" y="0" width={W} height={HORIZON} fill="url(#dawn-glow)" />
      <g className="dawn-rays" style={{ transformOrigin: `${SUN_X}px ${HORIZON}px` }}>
        {Array.from({ length: 14 }, (_, i) => {
          const a = -90 + (i - 6.5) * 13
          const ex = Math.round(SUN_X + Math.cos((a * Math.PI) / 180) * 1400)
          const ey = Math.round(HORIZON + Math.sin((a * Math.PI) / 180) * 1400)
          return <path key={i} className="dawn-ray" d={`M${SUN_X} ${HORIZON} L ${ex - 48} ${ey} L ${ex + 48} ${ey} Z`} />
        })}
      </g>

      {/* Far ridge, mist in the valley, two nearer ridges. The hills dip
          under the sun so the portrait stands in a saddle. */}
      <path className="dawn-ridge" data-depth="3" d={ridge(HORIZON + 6, [[0, 292], [110, 266], [240, 284], [360, 254], [500, 278], [620, 258], [740, 282], [830, 296], [930, 294], [1040, 262], [1140, 276], [1200, 268]])} />
      <rect className="dawn-mist-band" x="0" y={HORIZON - 34} width={W} height="80" fill="url(#dawn-mist)" />
      <path className="dawn-ridge" data-depth="2" d={ridge(HORIZON + 44, [[0, 334], [100, 318], [220, 330], [340, 308], [480, 328], [600, 312], [720, 334], [860, 338], [980, 320], [1100, 316], [1200, 330]])} />
      <path className="dawn-ridge" data-depth="1" d={ridge(HORIZON + 84, [[0, 374], [140, 360], [280, 370], [420, 354], [560, 368], [700, 356], [840, 372], [980, 358], [1120, 370], [1200, 364]])} />
    </svg>
  )
}
