/**
 * The نيويورك tower — drawn, because the catalogue has no night city.
 *
 * Third pass of the hero: the portrait is no longer one lit window in the
 * building, it is the BILLBOARD on it. A Times Square facade — a wall of
 * windows, a giant LED screen mounted on it with a theatre-marquee frame of
 * chasing bulbs, a canopy under the screen throwing light down, a vertical
 * red neon sign down the building's edge, and the street door with its spill
 * at the foot. The portrait is placed over the screen in the layout.
 *
 * Every window is a `<rect>` with a fixed opacity; a handful animate, on
 * opacity only. The marquee bulbs chase on the same three-phase keyframes the
 * corner sign uses.
 */

const COLS = 8
const ROWS = 20
const W = 176
const H = 300

/** Where the screen sits on the face (the CSS places the portrait over it). */
export const SCREEN = { x: 22, y: 44, w: 132, h: 132 }

/** Deterministic, so the building looks the same on the server and the client. */
function lightness(i: number) {
  const n = (i * 2654435761) % 1000
  if (n < 300) return 0 // dark: nobody home
  if (n < 560) return 1 // dim
  if (n < 820) return 2 // lit
  return 3 // bright
}

export function TowerFacade() {
  const windows = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = 10 + c * 20
      const y = 10 + r * 14
      // No windows under the screen or the canopy.
      if (y + 9 > SCREEN.y - 4 && y < SCREEN.y + SCREEN.h + 26 && x + 12 > SCREEN.x - 6 && x < SCREEN.x + SCREEN.w + 6) continue
      const i = r * COLS + c
      windows.push(
        <rect
          key={i}
          className="tower-window"
          data-lit={lightness(i)}
          data-blink={i % 13 === 5 ? (i % 3) + 1 : undefined}
          x={x}
          y={y}
          width={12}
          height={9}
          rx={1}
        />
      )
    }
  }

  // Marquee bulbs around the screen, in three chase phases.
  const bulbs = []
  const step = 12
  let k = 0
  const bx0 = SCREEN.x - 7
  const by0 = SCREEN.y - 7
  const bx1 = SCREEN.x + SCREEN.w + 7
  const by1 = SCREEN.y + SCREEN.h + 7
  for (let x = bx0; x <= bx1; x += step) bulbs.push({ x, y: by0, k: k++ })
  for (let y = by0 + step; y <= by1; y += step) bulbs.push({ x: bx1, y, k: k++ })
  for (let x = bx1 - step; x >= bx0; x -= step) bulbs.push({ x, y: by1, k: k++ })
  for (let y = by1 - step; y > by0; y -= step) bulbs.push({ x: bx0, y, k: k++ })

  const doorX = W / 2 - 16
  return (
    <svg className="tower" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tower-spill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="tower-spill-a" />
          <stop offset="1" className="tower-spill-b" />
        </linearGradient>
        <radialGradient id="tower-door-glow">
          <stop offset="0" className="tower-door-a" />
          <stop offset="1" className="tower-door-b" />
        </radialGradient>
      </defs>

      {/* The slab, with the stepped crown that says this city, and its mast. */}
      <path className="tower-body" d={`M4 ${H} V26 h18 V12 h22 V2 h22 v10 h22 v14 h18 V${H} Z`} />
      <line className="tower-mast" x1={W / 2} y1="2" x2={W / 2} y2="-18" />
      <circle className="tower-beacon" cx={W / 2} cy="-20" r="2.6" />
      <g className="tower-grid">{windows}</g>

      {/* The screen: its glow on the wall, the bezel, the marquee bulbs. The
          portrait itself is HTML, placed over this rect by CSS. */}
      <rect className="tower-screen-glow" x={SCREEN.x - 18} y={SCREEN.y - 18} width={SCREEN.w + 36} height={SCREEN.h + 36} rx="10" />
      <rect className="tower-screen-bezel" x={SCREEN.x - 4} y={SCREEN.y - 4} width={SCREEN.w + 8} height={SCREEN.h + 8} rx="4" />
      <g className="tower-marquee">
        {bulbs.map((b) => (
          <circle key={b.k} className="tower-bulb" data-phase={b.k % 3} cx={b.x} cy={b.y} r="2.4" />
        ))}
      </g>

      {/* The canopy under the screen, and the light it throws down the wall. */}
      <rect className="tower-canopy" x={SCREEN.x - 10} y={SCREEN.y + SCREEN.h + 12} width={SCREEN.w + 20} height="7" rx="1.5" />
      <rect className="tower-canopy-light" x={SCREEN.x - 10} y={SCREEN.y + SCREEN.h + 19} width={SCREEN.w + 20} height="34" fill="url(#tower-spill)" />

      {/* A vertical neon sign down the start edge of the building. */}
      <g className="tower-vsign">
        <rect className="tower-vsign-glow" x="6" y="186" width="26" height="92" rx="5" />
        <rect className="tower-vsign-bar" x="10" y="190" width="18" height="84" rx="2" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className="tower-vsign-letter" data-phase={i % 3} x="14" y={196 + i * 15} width="10" height="9" rx="1.5" />
        ))}
      </g>

      {/* The door at street level, lit from inside, with two people at it. */}
      <ellipse className="tower-door-glow" cx={W / 2} cy={H} rx="44" ry="18" fill="url(#tower-door-glow)" />
      <rect className="tower-door" x={doorX} y={H - 30} width="32" height="30" rx="1" />
      <rect className="tower-door-light" x={doorX + 3} y={H - 27} width="26" height="27" />
      <g className="tower-people">
        <circle cx={doorX - 8} cy={H - 13} r="2.2" />
        <rect x={doorX - 10} y={H - 11} width="4" height="11" rx="1.8" />
        <circle cx={doorX + 42} cy={H - 12} r="2.2" />
        <rect x={doorX + 40} y={H - 10} width="4" height="10" rx="1.8" />
      </g>
    </svg>
  )
}
