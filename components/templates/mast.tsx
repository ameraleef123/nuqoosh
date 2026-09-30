/**
 * مَدى — the mast, and the country the signal reaches. Drawn.
 *
 * The first mast was a 3 KB catalogue icon: a small tower with two arcs, the
 * size of a stamp in the corner of the hero. Range is the distance a signal
 * actually gets, and a stamp has no distance in it. So the mast is now drawn
 * at full height — a tapered steel lattice with its struts and bracing, guy
 * wires to the ground, a platform of panels near the top, and a lamp that
 * beats — with the portrait standing at its foot. And the PAGE is the country
 * around it: range rings that open from the lamp and run out across the whole
 * viewport, a horizon at the foot of the screen with the lights of distant
 * towns on it (the ones the signal reaches), and the scan grid ruled over all
 * of it.
 *
 * SVG and CSS; the lamp, the rings and the town lights animate on opacity and
 * scale only.
 */

/** Deterministic, so both sides draw the same horizon. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

const MAST_W = 120
const MAST_H = 320
const TOP = 26
const BASE = 300

/** Width of the lattice at height y: 14 at the top, 58 at the base. */
function half(y: number) {
  return 7 + ((y - TOP) / (BASE - TOP)) * 22
}

/** Struts every 22 units, each with an X brace to the next. */
const LEVELS = Array.from({ length: 13 }, (_, i) => TOP + 8 + i * 22)

export function Mast() {
  const cx = MAST_W / 2
  return (
    <svg className="mast-draw" viewBox={`0 0 ${MAST_W} ${MAST_H}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      {/* Guy wires, from just under the platform to anchors either side. */}
      <g className="mast-wire">
        <path d={`M${cx - half(70)} 70 L 6 ${BASE + 6}`} />
        <path d={`M${cx + half(70)} 70 L ${MAST_W - 6} ${BASE + 6}`} />
        <path d={`M${cx - half(180)} 180 L 14 ${BASE + 6}`} />
        <path d={`M${cx + half(180)} 180 L ${MAST_W - 14} ${BASE + 6}`} />
      </g>

      {/* The two legs. */}
      <g className="mast-steel">
        <path d={`M${cx - half(TOP)} ${TOP} L ${cx - half(BASE)} ${BASE}`} />
        <path d={`M${cx + half(TOP)} ${TOP} L ${cx + half(BASE)} ${BASE}`} />
        {/* Struts and X bracing between them. */}
        {LEVELS.map((y, i) => {
          const y2 = Math.min(y + 22, BASE)
          return (
            <g key={i}>
              <path d={`M${cx - half(y)} ${y} H ${cx + half(y)}`} />
              <path className="mast-brace" d={`M${cx - half(y)} ${y} L ${cx + half(y2)} ${y2} M${cx + half(y)} ${y} L ${cx - half(y2)} ${y2}`} />
            </g>
          )
        })}
      </g>

      {/* The platform near the top, with its panels. */}
      <rect className="mast-panel" x={cx - 16} y={52} width={7} height={20} rx={1} />
      <rect className="mast-panel" x={cx + 9} y={52} width={7} height={20} rx={1} />
      <path className="mast-steel" d={`M${cx - 18} 74 H ${cx + 18}`} />
      {/* A small dish, facing out. */}
      <path className="mast-dish" d={`M${cx + 10} 110 a 9 9 0 0 1 0 18 Z`} />

      {/* The lamp at the very top, and its glow. */}
      <path className="mast-steel" d={`M${cx} ${TOP} V 8`} />
      <circle className="mast-lamp-glow" cx={cx} cy={6} r={9} />
      <circle className="mast-lamp" cx={cx} cy={6} r={3} />

      {/* Ground: a short base plate and the anchors. */}
      <path className="mast-ground" d={`M${cx - half(BASE) - 10} ${BASE} H ${cx + half(BASE) + 10}`} />
    </svg>
  )
}

const TOWNS = [
  // [x, count, spread] — clusters of lights along the horizon.
  [90, 5, 34],
  [260, 3, 16],
  [430, 8, 60],
  [640, 2, 10],
  [820, 6, 44],
  [1010, 4, 26],
  [1180, 9, 70],
  [1360, 3, 18],
] as const

const LIGHTS = TOWNS.flatMap(([x, n, spread], t) =>
  Array.from({ length: n }, (_, i) => ({
    x: x + (i - (n - 1) / 2) * (spread / Math.max(n - 1, 1)) + (hash(t * 31 + i * 7) / 1000) * 6 - 3,
    y: 72 - (hash(t * 17 + i * 11) / 1000) * 5,
    r: 1 + (hash(t * 13 + i * 3) / 1000) * 1.2,
    blink: (t + i) % 5 === 0 ? ((t + i) % 3) + 1 : undefined,
  }))
)

/** The country the signal reaches: rings opening from the lamp's corner
 *  across the viewport, and the far horizon with its lights. */
export function SignalField() {
  return (
    <>
      <div className="signal-rings" aria-hidden="true">
        <span data-ring="1" />
        <span data-ring="2" />
        <span data-ring="3" />
        <span data-ring="4" />
      </div>

      <svg className="signal-horizon" viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        {/* The land, and a hairline where it meets the sky. */}
        <path className="signal-land" d="M0 76 C 180 70, 360 80, 540 74 C 720 68, 900 78, 1080 72 C 1260 66, 1360 74, 1440 70 V120 H0 Z" />
        <path className="signal-edge" d="M0 76 C 180 70, 360 80, 540 74 C 720 68, 900 78, 1080 72 C 1260 66, 1360 74, 1440 70" />
        {/* Two far masts of other stations, lamps lit. */}
        <path className="signal-far-mast" d="M430 74 V 46 M1180 72 V 40" />
        <circle className="signal-light" data-blink="2" cx="430" cy="45" r="1.6" />
        <circle className="signal-light" data-blink="3" cx="1180" cy="39" r="1.6" />
        {LIGHTS.map((l, i) => (
          <circle key={i} className="signal-light" data-blink={l.blink} cx={l.x.toFixed(1)} cy={l.y.toFixed(1)} r={l.r.toFixed(1)} />
        ))}
      </svg>
    </>
  )
}
