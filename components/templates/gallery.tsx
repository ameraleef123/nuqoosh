/**
 * فن — the gallery, by day. Drawn.
 *
 * The light page was La Gioconda's landscape blurred into a beige wall, and
 * the owner asked for it to be ART, especially by day. A gallery by day is a
 * white room lit from a skylight, with a wooden floor, a track of spotlights
 * on the ceiling, and PAINTINGS on the wall — so that is what the page is
 * now. The Mona Lisa keeps the centre in a gilded frame under her own light,
 * and around her hang four drawn works, each a different school: a Mondrian
 * grid, a Kandinsky of circles, a Rothko of two fields, and one loose brush
 * stroke. Those four are where the pigments live.
 *
 * SVG and CSS; the spotlights breathe on opacity, nothing else moves.
 */

/** A frame around a work: a moulding with a bevel and a shadow on the wall. */
function Frame({ x, y, w, h, gilt, children }: { x: number; y: number; w: number; h: number; gilt?: boolean; children: React.ReactNode }) {
  const m = gilt ? 14 : 9
  return (
    <g className="gal-work">
      <rect className="gal-shadow" x={x + 4} y={y + 8} width={w} height={h} rx="1" />
      <rect className={gilt ? 'gal-frame-gilt' : 'gal-frame'} x={x} y={y} width={w} height={h} rx="1" />
      <rect className="gal-bevel" x={x + m * 0.55} y={y + m * 0.55} width={w - m * 1.1} height={h - m * 1.1} />
      <rect className="gal-mat" x={x + m} y={y + m} width={w - 2 * m} height={h - 2 * m} />
      <g transform={`translate(${x + m} ${y + m})`}>{children}</g>
    </g>
  )
}

function Mondrian({ w, h }: { w: number; h: number }) {
  return (
    <g className="gal-mondrian">
      <rect x="0" y="0" width={w} height={h} fill="#fbfaf7" />
      <rect x="0" y="0" width={w * 0.34} height={h * 0.62} className="gal-pig-red" />
      <rect x={w * 0.7} y={h * 0.62} width={w * 0.3} height={h * 0.38} className="gal-pig-blue" />
      <rect x={w * 0.34} y={h * 0.8} width={w * 0.14} height={h * 0.2} className="gal-pig-yellow" />
      <g className="gal-lines">
        <path d={`M${w * 0.34} 0 V ${h} M${w * 0.7} 0 V ${h} M0 ${h * 0.62} H ${w} M${w * 0.34} ${h * 0.8} H ${w * 0.7} M${w * 0.48} ${h * 0.8} V ${h}`} />
      </g>
    </g>
  )
}

function Kandinsky({ w, h }: { w: number; h: number }) {
  const cells = [
    [0, 0, 'red', 'blue'],
    [1, 0, 'yellow', 'teal'],
    [2, 0, 'violet', 'yellow'],
    [0, 1, 'teal', 'red'],
    [1, 1, 'blue', 'yellow'],
    [2, 1, 'red', 'violet'],
  ] as const
  const cw = w / 3
  const ch = h / 2
  return (
    <g className="gal-kandinsky">
      <rect x="0" y="0" width={w} height={h} fill="#efe6d6" />
      {cells.map(([cx, cy, a, b], i) => (
        <g key={i}>
          <circle className={`gal-pig-${a}`} cx={cx * cw + cw / 2} cy={cy * ch + ch / 2} r={Math.min(cw, ch) * 0.42} />
          <circle className={`gal-pig-${b}`} cx={cx * cw + cw / 2} cy={cy * ch + ch / 2} r={Math.min(cw, ch) * 0.26} />
          <circle className="gal-ink" cx={cx * cw + cw / 2} cy={cy * ch + ch / 2} r={Math.min(cw, ch) * 0.1} />
        </g>
      ))}
    </g>
  )
}

function Rothko({ w, h }: { w: number; h: number }) {
  return (
    <g className="gal-rothko">
      <rect x="0" y="0" width={w} height={h} className="gal-pig-red" />
      <rect x={w * 0.06} y={h * 0.06} width={w * 0.88} height={h * 0.5} rx="2" className="gal-pig-yellow" opacity="0.92" />
      <rect x={w * 0.06} y={h * 0.6} width={w * 0.88} height={h * 0.34} rx="2" className="gal-pig-violet" opacity="0.85" />
    </g>
  )
}

function Stroke({ w, h }: { w: number; h: number }) {
  return (
    <g className="gal-stroke">
      <rect x="0" y="0" width={w} height={h} fill="#fbfaf7" />
      <path className="gal-pig-teal" d={`M${w * 0.1} ${h * 0.7} C ${w * 0.25} ${h * 0.2}, ${w * 0.45} ${h * 0.9}, ${w * 0.62} ${h * 0.4} S ${w * 0.85} ${h * 0.3}, ${w * 0.9} ${h * 0.6}`} fill="none" strokeWidth={h * 0.16} strokeLinecap="round" />
      <path className="gal-pig-red" d={`M${w * 0.15} ${h * 0.35} C ${w * 0.4} ${h * 0.15}, ${w * 0.6} ${h * 0.55}, ${w * 0.85} ${h * 0.25}`} fill="none" strokeWidth={h * 0.07} strokeLinecap="round" />
      <circle className="gal-pig-yellow" cx={w * 0.78} cy={h * 0.72} r={h * 0.09} />
    </g>
  )
}

export function GalleryRoom() {
  const W = 1440
  const H = 900
  const FLOOR = 760
  return (
    <svg className="gal-room" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gal-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="gal-floor-a" />
          <stop offset="1" className="gal-floor-b" />
        </linearGradient>
        <linearGradient id="gal-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="gal-cone-a" />
          <stop offset="1" className="gal-cone-b" />
        </linearGradient>
      </defs>

      {/* The floor: boards, and the wall's reflection in the polish. */}
      <rect className="gal-floor" x="0" y={FLOOR} width={W} height={H - FLOOR} fill="url(#gal-floor)" />
      <g className="gal-boards">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1="0" y1={FLOOR + 10 + i * 11} x2={W} y2={FLOOR + 10 + i * 11} />
        ))}
      </g>
      <line className="gal-skirting" x1="0" y1={FLOOR} x2={W} y2={FLOOR} />

      {/* The ceiling track and its spotlights, each throwing a cone. */}
      <rect className="gal-track" x="0" y="0" width={W} height="6" />
      {[200, 520, 720, 920, 1240].map((x, i) => (
        <g key={x} className="gal-spot" data-spot={(i % 3) + 1}>
          <path className="gal-cone" d={`M${x - 6} 12 L ${x - 150} ${FLOOR} L ${x + 150} ${FLOOR} L ${x + 6} 12 Z`} fill="url(#gal-cone)" />
          <rect className="gal-lamp" x={x - 9} y="4" width="18" height="16" rx="3" />
        </g>
      ))}

      {/* The works. The Mona Lisa in the centre is the photograph, placed by
          CSS in its own frame (gal-mona); these are her company. */}
      <Frame x={90} y={230} w={210} h={270}>
        <Mondrian w={192} h={252} />
      </Frame>
      <Frame x={370} y={330} w={200} h={150}>
        <Rothko w={182} h={132} />
      </Frame>
      <Frame x={880} y={300} w={230} h={170}>
        <Kandinsky w={212} h={152} />
      </Frame>
      <Frame x={1170} y={210} w={190} h={250}>
        <Stroke w={172} h={232} />
      </Frame>
      {/* La Gioconda, in a gilded frame at the centre. Public-domain scan,
          served from this project (public/art/monalisa.webp). */}
      <Frame x={590} y={150} w={260} h={380} gilt>
        <image href="/art/monalisa.webp" x="0" y="0" width="232" height="352" preserveAspectRatio="xMidYMid slice" />
      </Frame>
      {/* A bench in front of her. */}
      <g className="gal-bench">
        <rect x={640} y={FLOOR - 40} width={160} height="12" rx="3" />
        <rect x={660} y={FLOOR - 28} width="10" height="28" />
        <rect x={770} y={FLOOR - 28} width="10" height="28" />
      </g>
    </svg>
  )
}
