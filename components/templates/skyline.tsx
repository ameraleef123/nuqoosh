/**
 * The نيويورك street — a block of the city at night, drawn.
 *
 * The free catalogue has no night city. Every "city" animation in it is
 * daytime flat illustration: cheerful coloured boxes on white, no lit windows,
 * no traffic. The owner asked for the real thing — «سيارات ناس هيك ابراج city
 * center» — so it is built here instead.
 *
 * Three layers, back to front:
 *
 *   1. Towers, with the crowns that make a skyline read as THIS city:
 *      setbacks stepping in as they rise, two spires, water tanks on the low
 *      roofs. A row of equal boxes is a bar chart, not a skyline.
 *   2. Windows — most of them dark, because a city reads as lights precisely
 *      because most of it is not lit.
 *   3. The street: headlights running one way, tail lights the other, and
 *      people on the sidewalk.
 *
 * Everything that moves is a `transform` on a handful of elements. The towers
 * and their eight hundred windows are painted once and never touched again.
 */

/** Deterministic: the same city on the server and the client. `Math.random()`
 *  here is a hydration mismatch on every load. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

type Crown = 'flat' | 'step' | 'spire' | 'tank'

/** x, width, height, crown. Heights are uneven and the tallest are off-centre:
 *  a real skyline has no middle. */
const TOWERS: readonly (readonly [number, number, number, Crown])[] = [
  [0, 54, 96, 'tank'],
  [50, 40, 150, 'flat'],
  [86, 62, 74, 'tank'],
  [144, 44, 132, 'step'],
  [184, 34, 186, 'spire'],
  [214, 68, 92, 'flat'],
  [278, 48, 118, 'step'],
  [322, 56, 70, 'tank'],
  [374, 38, 160, 'spire'],
  [408, 66, 86, 'flat'],
  [470, 44, 126, 'step'],
  [510, 58, 78, 'tank'],
  [564, 36, 140, 'flat'],
  [596, 62, 104, 'step'],
  [654, 42, 168, 'spire'],
  [692, 70, 82, 'tank'],
  [758, 46, 138, 'flat'],
  [800, 54, 96, 'step'],
  [850, 38, 178, 'spire'],
  [884, 64, 72, 'tank'],
  [944, 48, 124, 'flat'],
  [988, 58, 88, 'step'],
  [1042, 40, 152, 'flat'],
  [1078, 66, 78, 'tank'],
  [1140, 44, 130, 'step'],
  [1180, 36, 164, 'spire'],
]

const GROUND = 214 // where the buildings stand
const VIEW_W = 1216 // about the width of a hero card, so `slice` crops almost nothing

function Crown({ x, w, top, kind, i }: { x: number; w: number; top: number; kind: Crown; i: number }) {
  if (kind === 'spire') {
    return (
      <>
        <rect className="city-tower" x={x + w / 2 - 5} y={top - 18} width={10} height={18} />
        <line className="city-spire" x1={x + w / 2} y1={top - 18} x2={x + w / 2} y2={top - 40} />
        <circle className="city-beacon" cx={x + w / 2} cy={top - 42} r={2} data-beacon={i % 2} />
      </>
    )
  }
  if (kind === 'step') {
    // Setbacks: the shape zoning laws gave this city.
    return (
      <>
        <rect className="city-tower" x={x + 5} y={top - 10} width={w - 10} height={10} />
        <rect className="city-tower" x={x + 11} y={top - 18} width={w - 22} height={8} />
      </>
    )
  }
  if (kind === 'tank') {
    // The wooden water tank on its little frame, which is the most New York
    // object on any roof in the city.
    const cx = x + w * 0.66
    return (
      <>
        <rect className="city-tower" x={cx - 6} y={top - 11} width={12} height={8} />
        <path className="city-tower" d={`M${cx - 6} ${top - 11} L${cx} ${top - 15} L${cx + 6} ${top - 11} Z`} />
        <line className="city-spire" x1={cx - 4} y1={top} x2={cx - 4} y2={top - 3} />
        <line className="city-spire" x1={cx + 4} y1={top} x2={cx + 4} y2={top - 3} />
      </>
    )
  }
  return null
}

export function CitySkyline() {
  return (
    <svg
      className="city-skyline"
      viewBox={`0 0 ${VIEW_W} 260`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {TOWERS.map(([x, w, h, crown], t) => {
        const top = GROUND - h
        const cols = Math.max(2, Math.floor((w - 6) / 9))
        const rows = Math.max(3, Math.floor((h - 8) / 11))
        const windows = []
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const n = hash(t * 977 + r * 31 + c)
            if (n < 540) continue // dark: most of a city is asleep
            windows.push(
              <rect
                key={`${r}-${c}`}
                className="city-window"
                data-lit={n > 890 ? 2 : 1}
                x={x + 4 + c * 9}
                y={top + 5 + r * 11}
                width={5}
                height={6}
              />
            )
          }
        }
        return (
          <g key={t}>
            <rect className="city-tower" x={x} y={top} width={w} height={h} />
            <Crown x={x} w={w} top={top} kind={crown} i={t} />
            {windows}
          </g>
        )
      })}

      {/* ── The street ───────────────────────────────────────────────── */}
      <rect className="city-road" x="0" y={GROUND + 16} width={VIEW_W} height="30" />
      <line className="city-kerb" x1="0" y1={GROUND + 16} x2={VIEW_W} y2={GROUND + 16} />

      {/* People on the sidewalk, between the buildings and the kerb. */}
      <g className="city-crowd">
        {Array.from({ length: 44 }, (_, i) => {
          // Stratified: one slot each, jittered inside it. A single hash put
          // them in an even row (a fence) and a modulo of two hashes piled
          // them into one clump. This is the only arrangement that reads as a
          // sidewalk.
          const slot = (VIEW_W - 16) / 44
          const px = 8 + i * slot + ((hash(i * 313 + 7) / 1000) * slot * 0.85)
          const tall = 6 + (hash(i * 977 + 41) % 4)
          return (
            <g key={i} className="city-person" data-walk={i % 4} style={{ transform: `translateX(${px.toFixed(1)}px)` }}>
              <circle cx="0" cy={GROUND + 7 - tall} r="1.5" />
              <rect x="-1.4" y={GROUND + 9 - tall} width="2.8" height={tall - 1} rx="1.1" />
            </g>
          )
        })}
      </g>

      {/* Traffic. Headlights run one way and tail lights the other, which is
          the single cheapest thing that makes a still drawing read as a city
          that is awake. */}
      <g className="city-traffic">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`h${i}`} className="car-head" data-lane={i} x="0" y={GROUND + 23} width="22" height="2.6" rx="1.3" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`t${i}`} className="car-tail" data-lane={i} x="0" y={GROUND + 35} width="18" height="2.4" rx="1.2" />
        ))}
      </g>
    </svg>
  )
}
