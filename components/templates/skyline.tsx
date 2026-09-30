/**
 * The نيويورك night — Manhattan, drawn, third pass.
 *
 * The owner sent three photographs and said to design from them: Radio City
 * in the rain with the neon smeared down a wet street; the skyline across the
 * water behind the Statue of Liberty, every tower glittering; and Times
 * Square at blue hour, the sky a deep cobalt and the LED billboards the
 * brightest thing in the frame. The earlier city was a thin band at the foot
 * of the page. This one IS the page:
 *
 *   - a cobalt sky, not black, with the city's own light hazing its foot
 *   - two flank towers rising the full height of the viewport at the edges,
 *     Times-Square style, with stacked LED screens, a vertical red neon sign
 *     and a lit box sign
 *   - the skyline across the middle, dense with bright windows, and the
 *     Statue of Liberty standing in front of it with her torch lit
 *   - the street at the foot: rain-wet asphalt with every light above it
 *     smeared down into a reflection, street lamps, traffic lights, a crowd
 *     under umbrellas, yellow cabs
 *   - rain, and a plane crossing
 *
 * Everything is one SVG painted once plus a handful of CSS layers; what moves
 * is transform or opacity on a few dozen elements.
 */

/** Deterministic: the same city on the server and the client. */
function hash(n: number) {
  return (n * 2654435761) % 1000
}

const W = 1440
const H = 900
const STREET = 700 // where the buildings stand
const ROAD_TOP = 736

/* ── The skyline across the middle ─────────────────────────────────────── */
type Kind = 'flat' | 'step' | 'spire' | 'tank' | 'wtc' | 'empire' | 'chrysler'
/** x, width, height, kind. */
const SKYLINE: readonly (readonly [number, number, number, Kind])[] = [
  [150, 40, 150, 'tank'],
  [186, 56, 210, 'step'],
  [246, 34, 120, 'flat'],
  [292, 48, 260, 'empire'],
  [346, 60, 170, 'flat'],
  [412, 38, 230, 'spire'],
  [456, 70, 140, 'tank'],
  [532, 44, 300, 'wtc'],
  [582, 58, 190, 'step'],
  [646, 36, 150, 'flat'],
  [688, 64, 240, 'chrysler'],
  [758, 42, 130, 'tank'],
  [806, 56, 210, 'step'],
  [868, 48, 170, 'flat'],
  [922, 38, 260, 'spire'],
  [966, 66, 150, 'tank'],
  [1038, 52, 200, 'step'],
  [1096, 44, 140, 'flat'],
  [1146, 40, 180, 'spire'],
]

function Crown({ x, w, top, kind, i }: { x: number; w: number; top: number; kind: Kind; i: number }) {
  const cx = x + w / 2
  switch (kind) {
    case 'spire':
      return (
        <>
          <rect className="ny-mass" x={cx - 5} y={top - 18} width={10} height={18} />
          <line className="ny-spire" x1={cx} y1={top - 18} x2={cx} y2={top - 44} />
          <circle className="ny-beacon" cx={cx} cy={top - 46} r={2.2} data-beacon={i % 2} />
        </>
      )
    case 'step':
      return (
        <>
          <rect className="ny-mass" x={x + 6} y={top - 12} width={w - 12} height={12} />
          <rect className="ny-mass" x={x + 12} y={top - 22} width={w - 24} height={10} />
        </>
      )
    case 'tank': {
      const tx = x + w * 0.66
      return (
        <>
          <rect className="ny-mass" x={tx - 7} y={top - 13} width={14} height={9} />
          <path className="ny-mass" d={`M${tx - 7} ${top - 13} L${tx} ${top - 18} L${tx + 7} ${top - 13} Z`} />
        </>
      )
    }
    case 'wtc':
      return (
        <>
          <line className="ny-needle" x1={cx} y1={top} x2={cx} y2={top - 70} />
          <circle className="ny-beacon" cx={cx} cy={top - 72} r={2.4} data-beacon={0} />
        </>
      )
    case 'empire':
      return (
        <>
          <rect className="ny-mass" x={cx - 10} y={top - 30} width={20} height={30} />
          <rect className="ny-mass" x={cx - 4} y={top - 66} width={8} height={36} />
          <line className="ny-needle" x1={cx} y1={top - 66} x2={cx} y2={top - 96} />
          <circle className="ny-beacon" cx={cx} cy={top - 98} r={2.2} data-beacon={1} />
          {/* The crown lit, as it is every night. */}
          <rect className="ny-crown-light" x={cx - 10} y={top - 30} width={20} height={30} />
        </>
      )
    case 'chrysler':
      return (
        <>
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={k} className="ny-mass" d={`M${cx - (20 - k * 4)} ${top - k * 12} Q ${cx} ${top - k * 12 - 16} ${cx + (20 - k * 4)} ${top - k * 12} Z`} />
          ))}
          {[0, 1, 2, 3, 4].map((k) => (
            <path key={`l${k}`} className="ny-crown-arc" d={`M${cx - (20 - k * 4)} ${top - k * 12} Q ${cx} ${top - k * 12 - 16} ${cx + (20 - k * 4)} ${top - k * 12}`} />
          ))}
          <line className="ny-needle" x1={cx} y1={top - 60} x2={cx} y2={top - 88} />
        </>
      )
    default:
      return null
  }
}

function Windows({ x, w, top, h, seed, cell = 9, pitch = 11, keep = 0.62 }: { x: number; w: number; top: number; h: number; seed: number; cell?: number; pitch?: number; keep?: number }) {
  const cols = Math.max(2, Math.floor((w - 6) / cell))
  const rows = Math.max(3, Math.floor((h - 10) / pitch))
  const out = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = hash(seed * 977 + r * 31 + c)
      if (n > keep * 1000) continue
      out.push(<rect key={`${r}-${c}`} className="ny-window" data-lit={n < 260 ? 2 : 1} x={x + 4 + c * cell} y={top + 6 + r * pitch} width={cell - 4} height={pitch - 5} />)
    }
  }
  return <>{out}</>
}

/* ── LED billboards ─────────────────────────────────────────────────────── */
function Board({ x, y, w, h, hue, flicker, seed }: { x: number; y: number; w: number; h: number; hue: 0 | 1 | 2 | 3; flicker?: boolean; seed: number }) {
  // Abstract content: a few blocks and bars, so it reads as an advert without
  // being one.
  const blocks = [0, 1, 2].map((k) => ({
    bx: x + 8 + (hash(seed * 7 + k * 13) / 1000) * (w - 40),
    by: y + 8 + (hash(seed * 11 + k * 17) / 1000) * (h - 30),
    bw: 14 + (hash(seed * 3 + k * 5) / 1000) * 24,
    bh: 6 + (hash(seed * 5 + k * 7) / 1000) * 12,
  }))
  return (
    <g className="ny-board" data-hue={hue} data-flicker={flicker ? 1 : undefined}>
      <rect className="ny-board-glow" x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="4" />
      <rect className="ny-board-face" x={x} y={y} width={w} height={h} rx="2" />
      <rect className="ny-board-bezel" x={x} y={y} width={w} height={h} rx="2" />
      {blocks.map((b, k) => (
        <rect key={k} className="ny-board-block" x={b.bx.toFixed(1)} y={b.by.toFixed(1)} width={b.bw.toFixed(1)} height={b.bh.toFixed(1)} rx="1" />
      ))}
      <path className="ny-board-lines" d={`M${x + 10} ${y + h - 10} H ${x + w * 0.6} M${x + 10} ${y + h - 16} H ${x + w * 0.4}`} />
    </g>
  )
}

/** A vertical neon sign, Radio-City style: a red bar with six lit "letter"
 *  blocks stacked down it, and the glow it throws on the wall. */
function VerticalSign({ x, y, h }: { x: number; y: number; h: number }) {
  const n = 6
  const step = (h - 16) / n
  return (
    <g className="ny-vsign">
      <rect className="ny-vsign-glow" x={x - 10} y={y - 8} width={44} height={h + 16} rx="6" />
      <rect className="ny-vsign-bar" x={x} y={y} width={24} height={h} rx="3" />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} className="ny-vsign-letter" data-phase={i % 3} x={x + 5} y={y + 8 + i * step} width={14} height={step - 8} rx="2" />
      ))}
    </g>
  )
}

/** A lit box sign on a bracket, like the subway lozenge in the photograph. */
function BoxSign({ x, y }: { x: number; y: number }) {
  return (
    <g className="ny-boxsign">
      <rect className="ny-boxsign-glow" x={x - 8} y={y - 8} width={96} height={44} rx="10" />
      <rect className="ny-boxsign-face" x={x} y={y} width={80} height={28} rx="6" />
      <rect className="ny-boxsign-bar" x={x + 14} y={y + 11} width={52} height={6} rx="3" />
      <line className="ny-bracket" x1={x + 80} y1={y + 14} x2={x + 100} y2={y + 14} />
    </g>
  )
}

/* ── Lady Liberty, in front of the skyline ──────────────────────────────── */
function Liberty({ x, base, h }: { x: number; base: number; h: number }) {
  // Proportions from the statue: the pedestal is about a third, the figure
  // two thirds, the torch arm a quarter above the crown. One silhouette path
  // in the drawing's own 100x300 box, scaled to h.
  const s = h / 300
  return (
    <g className="ny-liberty" transform={`translate(${x} ${base}) scale(${s}) translate(-50 -300)`}>
      {/* Pedestal. */}
      <path className="ny-liberty-stone" d="M18 300 V 262 L 24 256 H 76 L 82 262 V 300 Z M28 256 V 236 H 72 V 256 Z M34 236 V 224 H 66 V 236 Z" />
      {/* The figure: robe, shoulders, head, crown, the tablet arm and the torch arm. */}
      <path
        className="ny-liberty-figure"
        d="M50 224 L 32 224 L 36 176 L 40 140 L 44 118 L 40 112 L 42 100 L 46 96 L 46 84 L 50 78 L 54 84 L 54 96 L 60 100 L 64 108 L 70 126 L 74 150 L 70 176 L 72 224 Z M46 90 L 42 86 L 44 94 Z M54 90 L 58 86 L 56 94 Z M60 108 L 66 92 L 70 66 L 72 44 L 76 30 L 78 40 L 74 70 L 70 98 L 66 116 Z M38 136 L 26 152 L 22 160 L 30 158 L 40 146 Z"
      />
      {/* Crown rays. */}
      <path className="ny-liberty-figure" d="M50 76 L 50 62 M44 78 L 40 66 M56 78 L 60 66 M40 84 L 30 76 M60 84 L 70 76" strokeWidth="2.4" />
      {/* The torch, lit. */}
      <ellipse className="ny-torch-glow" cx="78" cy="26" rx="16" ry="12" />
      <path className="ny-torch" d="M74 30 L 82 30 L 80 22 L 78 14 L 76 22 Z" />
    </g>
  )
}

/* ── Street furniture and people ────────────────────────────────────────── */
function Lamp({ x }: { x: number }) {
  return (
    <g className="ny-lamp">
      <line className="ny-pole" x1={x} y1={ROAD_TOP - 2} x2={x} y2={ROAD_TOP - 64} />
      <line className="ny-pole" x1={x} y1={ROAD_TOP - 64} x2={x + 14} y2={ROAD_TOP - 64} />
      <ellipse className="ny-lamp-glow" cx={x + 16} cy={ROAD_TOP - 62} rx="18" ry="10" />
      <rect className="ny-lamp-head" x={x + 12} y={ROAD_TOP - 66} width="8" height="4" rx="1" />
    </g>
  )
}

function TrafficLight({ x, green }: { x: number; green?: boolean }) {
  return (
    <g className="ny-signal" data-green={green ? 1 : undefined}>
      <line className="ny-pole" x1={x} y1={ROAD_TOP - 2} x2={x} y2={ROAD_TOP - 52} />
      <rect className="ny-signal-box" x={x - 5} y={ROAD_TOP - 68} width="10" height="22" rx="2" />
      <circle className="ny-signal-red" cx={x} cy={ROAD_TOP - 62} r="2.6" />
      <circle className="ny-signal-green" cx={x} cy={ROAD_TOP - 50} r="2.6" />
    </g>
  )
}

function Cab({ lane, dir }: { lane: number; dir: 'head' | 'tail' }) {
  const y = dir === 'head' ? ROAD_TOP + 8 : ROAD_TOP + 26
  return (
    <g className={dir === 'head' ? 'car-head' : 'car-tail'} data-lane={lane}>
      <rect className="ny-cab" x="0" y={y + 4} width="30" height="8" rx="2" />
      <rect className="ny-cab" x="7" y={y} width="15" height="5" rx="2" />
      <rect className="ny-cab-glass" x="9" y={y + 1} width="11" height="3" rx="1" />
      <rect className="ny-cab-light" x="12" y={y - 3} width="6" height="3" rx="1" />
      {dir === 'head' ? <rect className="ny-headlight" x="29" y={y + 6} width="7" height="3" rx="1.5" /> : <rect className="ny-taillight" x="-4" y={y + 6} width="5" height="3" rx="1.5" />}
      <ellipse className={dir === 'head' ? 'ny-cab-reflect-head' : 'ny-cab-reflect-tail'} cx="15" cy={y + 22} rx="16" ry="4" />
    </g>
  )
}

const CROWD = Array.from({ length: 36 }, (_, i) => {
  const slot = (W - 340) / 36
  return {
    x: 170 + i * slot + (hash(i * 313 + 7) / 1000) * slot * 0.8,
    tall: 14 + (hash(i * 977 + 41) % 6),
    umbrella: hash(i * 19 + 3) < 450,
    walk: i % 4,
  }
})

/** The lights whose reflections run down the wet street: x, width, hue. */
const REFLECT: readonly (readonly [number, number, number])[] = [
  [30, 110, 0], // pink screen, left flank
  [30, 110, 1],
  [58, 30, 3], // red vertical sign
  [1300, 110, 1],
  [1300, 110, 2],
  [1330, 60, 4], // the box sign, white
  [520, 60, 4], // lamps
  [900, 60, 4],
  [300, 44, 2], // the Empire crown
  [700, 60, 1], // Chrysler
]

export function CitySkyline() {
  return (
    <>
      {/* Rain and the fog it hangs in: CSS layers, dark only. */}
      <span className="ny-rain" />
      <span className="ny-fog" />

      <svg className="city-skyline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ny-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="ny-haze-a" />
            <stop offset="1" className="ny-haze-b" />
          </linearGradient>
          <linearGradient id="ny-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ny-wet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="ny-wet-a" />
            <stop offset="1" className="ny-wet-b" />
          </linearGradient>
        </defs>

        {/* ── Sky ─────────────────────────────────────────────────────── */}
        <g className="ny-stars">
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} className="ny-star" data-twinkle={i % 8 === 3 ? (i % 3) + 1 : undefined} cx={((i * W) / 40 + (hash(i * 7 + 1) / 1000) * 30).toFixed(1)} cy={(10 + (hash(i * 13 + 3) / 1000) * 260).toFixed(1)} r={(0.6 + (hash(i * 5 + 2) / 1000) * 0.9).toFixed(1)} />
          ))}
        </g>
        <rect className="ny-haze-band" x="0" y={STREET - 320} width={W} height="320" fill="url(#ny-haze)" />
        <g className="ny-plane">
          <line className="ny-plane-body" x1="0" y1="0" x2="12" y2="0" />
          <circle className="ny-plane-strobe" cx="0" cy="0" r="1.6" />
          <circle className="ny-plane-tail" cx="12" cy="0" r="1.2" />
        </g>

        {/* ── The skyline across the middle ───────────────────────────── */}
        {SKYLINE.map(([x, w, h, kind], i) => {
          const top = STREET - h
          return (
            <g key={i}>
              <rect className="ny-mass" x={x} y={top} width={w} height={h} />
              <Crown x={x} w={w} top={top} kind={kind} i={i} />
              <Windows x={x} w={w} top={top} h={h} seed={i + 40} cell={8} pitch={10} keep={0.58} />
              {kind === 'wtc' ? <rect className="ny-wtc-glass" x={x} y={top} width={w} height={h} /> : null}
            </g>
          )
        })}

        {/* Lady Liberty, standing in front of the far towers on the end side. */}
        <Liberty x={1215} base={STREET + 2} h={330} />

        {/* ── The flank towers, full height ───────────────────────────── */}
        <g className="ny-flank">
          <rect className="ny-flank-face" x="0" y="0" width="176" height={STREET} />
          <Windows x={0} w={176} top={0} h={STREET} seed={7} cell={11} pitch={14} keep={0.5} />
          <Board x={26} y={90} w={122} h={78} hue={0} seed={1} />
          <Board x={26} y={196} w={122} h={110} hue={1} flicker seed={2} />
          <Board x={26} y={334} w={122} h={78} hue={2} seed={3} />
          <VerticalSign x={46} y={430} h={210} />
          <rect className="ny-awning" x="0" y={STREET - 30} width="150" height="8" />
        </g>
        <g className="ny-flank">
          <rect className="ny-flank-face" x={W - 176} y="0" width="176" height={STREET} />
          <Windows x={W - 176} w={176} top={0} h={STREET} seed={9} cell={11} pitch={14} keep={0.5} />
          <Board x={W - 150} y={60} w={122} h={130} hue={1} seed={4} />
          <Board x={W - 150} y={218} w={122} h={78} hue={3} seed={5} />
          <Board x={W - 150} y={324} w={122} h={110} hue={0} flicker seed={6} />
          <BoxSign x={W - 196} y={560} />
          {/* A wide screen wrapping the corner at street level. */}
          <g className="ny-board" data-hue={2}>
            <rect className="ny-board-glow" x={W - 200} y={606} width="220" height="70" rx="4" />
            <path className="ny-board-face" d={`M${W - 190} 616 L ${W} 604 V 668 L ${W - 190} 672 Z`} />
            <path className="ny-board-lines" d={`M${W - 176} 632 L ${W - 60} 626 M${W - 176} 646 L ${W - 100} 642`} />
          </g>
        </g>

        {/* ── The street ──────────────────────────────────────────────── */}
        <rect className="ny-sidewalk" x="0" y={STREET} width={W} height={ROAD_TOP - STREET} />
        <rect className="ny-road" x="0" y={ROAD_TOP} width={W} height={H - ROAD_TOP} />
        <rect className="ny-road-wet" x="0" y={ROAD_TOP} width={W} height={H - ROAD_TOP} fill="url(#ny-wet)" />
        {/* Reflections: every bright thing above, smeared straight down into the
            wet asphalt. Blurred once; they shimmer on opacity. */}
        <g className="ny-reflections">
          {REFLECT.map(([x, w, hue], i) => (
            <rect key={i} className="ny-reflection" data-hue={hue} data-shimmer={(i % 3) + 1} x={x} y={ROAD_TOP} width={w} height={H - ROAD_TOP} />
          ))}
        </g>
        <line className="ny-kerb" x1="0" y1={ROAD_TOP} x2={W} y2={ROAD_TOP} />
        <path className="ny-lane-marks" d={`M0 ${ROAD_TOP + 22} H ${W}`} />

        {/* Steam. */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} className="ny-steam" data-puff={i} cx="640" cy={ROAD_TOP + 2} rx="9" ry="6" />
        ))}

        {/* Lamps and lights. */}
        <Lamp x={520} />
        <Lamp x={900} />
        <TrafficLight x={230} green />
        <TrafficLight x={1210} />

        {/* The crowd, under umbrellas, on the sidewalk. */}
        <g className="ny-crowd">
          {CROWD.map((p, i) => (
            <g key={i} className="ny-person" data-walk={p.walk} style={{ transform: `translateX(${p.x.toFixed(1)}px)` }}>
              <circle cx="0" cy={ROAD_TOP - 6 - p.tall + 3} r="2.4" />
              <rect x="-2.4" y={ROAD_TOP - 4 - p.tall + 4} width="4.8" height={p.tall - 2} rx="2" />
              {p.umbrella ? <path className="ny-umbrella" d={`M-9 ${ROAD_TOP - 8 - p.tall} Q 0 ${ROAD_TOP - 18 - p.tall} 9 ${ROAD_TOP - 8 - p.tall} Z`} /> : null}
            </g>
          ))}
        </g>

        {/* Traffic. */}
        <g className="ny-traffic">
          {[0, 1, 2, 3].map((i) => (
            <Cab key={`h${i}`} lane={i} dir="head" />
          ))}
          {[0, 1, 2].map((i) => (
            <Cab key={`t${i}`} lane={i} dir="tail" />
          ))}
        </g>
      </svg>
    </>
  )
}

/**
 * The hero's far corner: a neon marquee sign, drawn — a frame of chasing bulbs
 * around a magenta skyline zigzag and a cyan underline.
 */
export function NeonSign() {
  const bulbs = []
  const SW = 200
  const SH = 120
  const step = 16
  let k = 0
  for (let x = 8; x <= SW - 8; x += step) bulbs.push({ x, y: 8, k: k++ })
  for (let y = 8 + step; y <= SH - 8; y += step) bulbs.push({ x: SW - 8, y, k: k++ })
  for (let x = SW - 8 - step; x >= 8; x -= step) bulbs.push({ x, y: SH - 8, k: k++ })
  for (let y = SH - 8 - step; y > 8; y -= step) bulbs.push({ x: 8, y, k: k++ })
  return (
    <svg className="neon-sign" viewBox={`0 0 ${SW} ${SH}`} aria-hidden="true" focusable="false">
      <rect className="neon-panel" x="2" y="2" width={SW - 4} height={SH - 4} rx="8" />
      {bulbs.map((b) => (
        <circle key={b.k} className="neon-bulb" data-phase={b.k % 3} cx={b.x} cy={b.y} r="3" />
      ))}
      <g className="neon-tube" data-tube="magenta">
        <path className="neon-glow" d="M30 78 L 50 46 L 66 66 L 84 30 L 102 62 L 122 40 L 140 72 L 158 52 L 170 78" />
        <path className="neon-core" d="M30 78 L 50 46 L 66 66 L 84 30 L 102 62 L 122 40 L 140 72 L 158 52 L 170 78" />
      </g>
      <g className="neon-tube" data-tube="cyan">
        <path className="neon-glow" d="M34 94 H 166" />
        <path className="neon-core" d="M34 94 H 166" />
      </g>
    </svg>
  )
}
