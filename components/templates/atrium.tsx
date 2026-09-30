/**
 * مَجلِس — the glass atrium. Drawn.
 *
 * The owner asked for the page to be corporate glass with the sun coming
 * through it, "like a glass dome". So the page is now seen from the floor of
 * an atrium: a dome of glazing overhead — radial mullions meeting concentric
 * rings, every pane a slightly different sky — with the sun behind one part
 * of it throwing a flare and shafts of light down through the panes, and the
 * building's own glass walls rising at the edges with their floor lines.
 *
 * SVG and CSS; the shafts and the flare breathe on opacity.
 */

const W = 1440
const CX = 720
const CY = -120 // the dome's centre sits above the viewport
const RINGS = [260, 400, 540, 690, 850, 1020]
const SPOKES = 20

function pane(i: number, r0: number, r1: number, seed: number) {
  const a0 = (i / SPOKES) * Math.PI * 2
  const a1 = ((i + 1) / SPOKES) * Math.PI * 2
  const p = (r: number, a: number) => `${(CX + Math.cos(a) * r).toFixed(1)} ${(CY + Math.sin(a) * r).toFixed(1)}`
  return { d: `M${p(r0, a0)} A ${r0} ${r0} 0 0 1 ${p(r0, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`, tint: ((seed * 2654435761) % 1000) / 1000 }
}

export function Atrium() {
  const panes = []
  for (let k = 0; k < RINGS.length - 1; k++) {
    for (let i = 0; i < SPOKES; i++) {
      // Only the lower half of the dome is on screen.
      const mid = ((i + 0.5) / SPOKES) * Math.PI * 2
      if (Math.sin(mid) < -0.1) continue
      panes.push({ ...pane(i, RINGS[k], RINGS[k + 1], k * 31 + i * 7), key: `${k}-${i}` })
    }
  }
  return (
    <>
      <span className="atrium-sun" />
      <span className="atrium-shaft" data-shaft="1" />
      <span className="atrium-shaft" data-shaft="2" />
      <span className="atrium-shaft" data-shaft="3" />

      <svg className="atrium" viewBox={`0 0 ${W} 900`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
        {/* The panes: each a slightly different tint of the sky through glass. */}
        <g className="atrium-panes">
          {panes.map((p) => (
            <path key={p.key} d={p.d} style={{ opacity: 0.35 + p.tint * 0.45 }} />
          ))}
        </g>
        {/* The glazing bars: rings and spokes. */}
        <g className="atrium-bars">
          {RINGS.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} />
          ))}
          {Array.from({ length: SPOKES }, (_, i) => {
            const a = (i / SPOKES) * Math.PI * 2
            if (Math.sin(a) < -0.15) return null
            const r0 = RINGS[0]
            const r1 = RINGS[RINGS.length - 1]
            // Rounded, so server and browser trig cannot disagree in the last digit.
            return <line key={i} x1={Math.round(CX + Math.cos(a) * r0)} y1={Math.round(CY + Math.sin(a) * r0)} x2={Math.round(CX + Math.cos(a) * r1)} y2={Math.round(CY + Math.sin(a) * r1)} />
          })}
        </g>
        {/* The oculus at the centre, and its heavy ring. */}
        <circle className="atrium-oculus" cx={CX} cy={CY} r={RINGS[0]} />
        <circle className="atrium-ring" cx={CX} cy={CY} r={RINGS[0]} />

        {/* The building's glass walls at both edges, with their floor lines
            and the sky reflected in them. */}
        <g className="atrium-wall">
          <rect x="0" y="0" width="120" height="900" />
          <rect x={W - 120} y="0" width="120" height="900" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <line x1="0" y1={80 + i * 96} x2="120" y2={80 + i * 96} />
              <line x1={W - 120} y1={80 + i * 96} x2={W} y2={80 + i * 96} />
            </g>
          ))}
          <line x1="60" y1="0" x2="60" y2="900" />
          <line x1={W - 60} y1="0" x2={W - 60} y2="900" />
        </g>
      </svg>
    </>
  )
}
