/**
 * The نيويورك tower — drawn, because the catalogue has no night city.
 *
 * Every "city" animation in the free library is daytime flat illustration:
 * cheerful coloured blocks on white. The whole of this template is lit windows
 * in the dark, and lit windows are the one thing none of that art has. They
 * are also the only way the portrait can be IN the building rather than beside
 * a picture of one — which is the test سِيق and مُحيط set.
 *
 * So the facade is drawn: a grid of windows, most of them lit to different
 * strengths, a few of them switching on and off the way a real tower does at
 * night. The portrait sits in the middle of it as one more lit window — yours.
 *
 * Every window is a `<rect>` with a fixed opacity; only eleven of them animate,
 * and only on opacity. The whole facade is about 3 KB of markup.
 */

const COLS = 6
const ROWS = 14

/** Deterministic, so the building looks the same on the server and the client
 *  — `Math.random()` here would be a hydration mismatch on every load. */
function lightness(i: number) {
  const n = (i * 2654435761) % 1000 // Knuth's multiplicative hash, cheap and stable
  if (n < 260) return 0 // dark: nobody home
  if (n < 520) return 1 // dim
  if (n < 800) return 2 // lit
  return 3 // bright
}

export function TowerFacade() {
  const windows = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c
      windows.push(
        <rect
          key={i}
          className="tower-window"
          data-lit={lightness(i)}
          // Every eleventh window is on a switch. Enough that the building is
          // never quite still, few enough that it never looks like a alarm.
          data-blink={i % 11 === 3 ? (i % 3) + 1 : undefined}
          x={8 + c * 18}
          y={10 + r * 13}
          width={12}
          height={9}
          rx={1}
        />
      )
    }
  }

  return (
    <svg
      className="tower"
      viewBox="0 0 120 196"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* The slab, and the setbacks that make it read as a tower rather than a
          box — the stepped crown is the one silhouette that says this city. */}
      <path className="tower-body" d="M4 196 V22 h14 V10 h18 V2 h14 v8 h18 v12 h14 v174 Z" />
      <g className="tower-grid">{windows}</g>
      {/* The mast on top, lit. */}
      <line className="tower-mast" x1="60" y1="2" x2="60" y2="-16" />
      <circle className="tower-beacon" cx="60" cy="-18" r="2.4" />
    </svg>
  )
}
