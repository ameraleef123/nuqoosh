/**
 * تسلا — the yard of the laboratory at night. Drawn.
 *
 * The storm (storm.tsx) strikes a few times a minute, and between strikes the
 * page was a violet-black void. Discharge is meant to be the resting state of
 * this template, so the page now has the machines that make it: a yard of
 * apparatus in silhouette along the foot of the viewport — two coils with
 * their toroids, a bank of capacitor jars, a spark gap on its posts, and the
 * Wardenclyffe tower with its mushroom cap — and every toroid carries a corona
 * that never goes out, breathing on its own cycle. Ionised dust drifts up
 * through the air above them.
 *
 * SVG and CSS; the coronas animate on opacity, the dust on transform.
 */

function hash(n: number) {
  return (n * 2654435761) % 1000
}

const DUST = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 100) / 18 + (hash(i * 7 + 2) / 1000) * 4,
  y: 30 + (hash(i * 11 + 5) / 1000) * 60,
  cycle: (i % 4) + 1,
}))

/** A coil: a base box, a wound secondary, a toroid on top. */
function Coil({ x, h, w }: { x: number; h: number; w: number }) {
  const base = 250
  const top = base - h
  return (
    <g className="lab-coil">
      <rect className="lab-silhouette" x={x - w} y={base - 22} width={w * 2} height={22} rx={2} />
      <rect className="lab-silhouette" x={x - w * 0.42} y={top + 14} width={w * 0.84} height={h - 36} rx={3} />
      {/* Winding lines up the secondary. */}
      <path
        className="lab-winding"
        d={Array.from({ length: Math.floor((h - 40) / 7) }, (_, i) => `M${x - w * 0.42} ${top + 20 + i * 7} H ${x + w * 0.42}`).join(' ')}
      />
      {/* The toroid, and its corona. */}
      <ellipse className="lab-corona" cx={x} cy={top + 10} rx={w * 1.35} ry={w * 0.5} />
      <ellipse className="lab-silhouette" cx={x} cy={top + 10} rx={w * 0.95} ry={w * 0.3} />
      <ellipse className="lab-toroid-lit" cx={x} cy={top + 8} rx={w * 0.7} ry={w * 0.16} />
    </g>
  )
}

export function LabYard() {
  return (
    <>
      {DUST.map((d, i) => (
        <span key={i} className="lab-dust" data-cycle={d.cycle} style={{ insetInlineStart: `${d.x}%`, insetBlockStart: `${d.y}%` }} />
      ))}

      <svg className="lab-yard" viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        {/* The ground. */}
        <rect className="lab-ground" x="0" y="248" width="1440" height="12" />

        <Coil x={190} h={200} w={30} />
        <Coil x={1230} h={150} w={24} />

        {/* Capacitor bank: four jars on a bench. */}
        <g className="lab-bank">
          <rect className="lab-silhouette" x="380" y="228" width="150" height="20" rx="2" />
          {[392, 428, 464, 500].map((x) => (
            <g key={x}>
              <rect className="lab-silhouette" x={x} y="176" width="26" height="52" rx="4" />
              <path className="lab-winding" d={`M${x + 13} 176 V 162`} />
              <circle className="lab-corona-small" cx={x + 13} cy="160" r="6" />
            </g>
          ))}
        </g>

        {/* The spark gap: two posts with balls, on a bench. */}
        <g className="lab-gap">
          <rect className="lab-silhouette" x="920" y="232" width="110" height="16" rx="2" />
          <rect className="lab-silhouette" x="946" y="180" width="6" height="52" />
          <rect className="lab-silhouette" x="998" y="180" width="6" height="52" />
          <circle className="lab-silhouette" cx="949" cy="178" r="9" />
          <circle className="lab-silhouette" cx="1001" cy="178" r="9" />
          <circle className="lab-corona-small" cx="949" cy="178" r="14" />
          <circle className="lab-corona-small" cx="1001" cy="178" r="14" />
          {/* The arc across the gap, part of the resting hum. */}
          <path className="lab-arc" d="M958 178 l 8 -5 l 6 7 l 7 -6 l 6 5 l 7 -3" />
        </g>

        {/* Wardenclyffe: a tapered tower with its mushroom cap. */}
        <g className="lab-tower">
          <path className="lab-silhouette" d="M690 248 L 712 60 H 728 L 750 248 Z" />
          <path className="lab-lattice" d="M700 200 H 740 M704 160 H 736 M708 120 H 732 M712 90 H 728" />
          <path className="lab-lattice" d="M695 248 L 738 120 M745 248 L 702 120" />
          <ellipse className="lab-corona" cx="720" cy="52" rx="64" ry="24" />
          <path className="lab-silhouette" d="M668 60 C 676 34, 764 34, 772 60 C 760 70, 680 70, 668 60 Z" />
          <ellipse className="lab-toroid-lit" cx="720" cy="46" rx="44" ry="8" />
        </g>
      </svg>
    </>
  )
}
