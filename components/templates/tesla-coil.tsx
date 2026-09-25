/**
 * The تسلا coil — drawn, because the object this template is named after
 * should actually be on the page.
 *
 * The first تسلا hero was a "spark gap": two separate plates with an arc
 * jumping between them. It was a clever diagram of Tesla's idea and it read as
 * a broken layout — two cards that had come apart. And the electricity around
 * it fired on a realistic schedule, which meant 96% of every cycle was dark:
 * a page that is almost always still does not feel electric, however accurate
 * the timing.
 *
 * So the machine itself is drawn here — base, primary winding, secondary
 * column, toroid — and the corona on the toroid never goes out. Discharge is
 * the page's resting state, not an event it waits for.
 *
 * Everything animated is opacity and transform. The whole thing is about 2 KB
 * of markup and no image is fetched.
 */

/** Short discharges leaving the toroid, each one branching once. */
const ARCS = [
  'M50 12 C 36 6, 26 14, 14 6 M32 9 L 26 2',
  'M50 12 C 64 5, 74 15, 88 4 M70 9 L 78 2',
  'M50 12 C 40 2, 30 0, 22 -8 M36 4 L 30 -4',
  'M50 12 C 60 1, 72 1, 80 -9 M65 4 L 72 -3',
] as const

export function TeslaCoil() {
  return (
    <div className="coil" aria-hidden="true">
      <svg className="coil-body" viewBox="0 0 100 160" focusable="false">
        {/* The secondary: a tall column of close turns. Drawn as one path of
            short horizontal strokes so the winding reads as winding. */}
        <g className="coil-winding">
          {Array.from({ length: 22 }, (_, i) => (
            <line key={i} x1="42" x2="58" y1={40 + i * 4} y2={40 + i * 4} />
          ))}
        </g>

        {/* The former and the base. */}
        <path className="coil-frame" d="M42 40 L42 128 M58 40 L58 128" />
        <path className="coil-frame" d="M30 128 H70 L74 142 H26 Z" />
        <path className="coil-frame" d="M20 142 H80" />

        {/* The primary winding, flared at the foot. */}
        <path className="coil-primary" d="M28 120 H72 M25 126 H75 M22 132 H78" />

        {/* The toroid, and the corona that never goes out. */}
        <ellipse className="coil-glow" cx="50" cy="30" rx="30" ry="12" />
        <ellipse className="coil-toroid" cx="50" cy="30" rx="24" ry="9" />
        <ellipse className="coil-toroid-lip" cx="50" cy="28" rx="24" ry="9" />
      </svg>

      {/* Discharges. Four of them on short, unrelated cycles, so at any instant
          at least one is lit — the point is that it never stops. */}
      <svg className="coil-arcs" viewBox="0 0 100 30" focusable="false">
        {ARCS.map((d, i) => (
          <g className="coil-arc" data-arc={i} key={i}>
            <path className="storm-halo" d={d} />
            <path className="storm-sheath" d={d} />
            <path className="storm-core" d={d} />
          </g>
        ))}
      </svg>
    </div>
  )
}
