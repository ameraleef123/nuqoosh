/**
 * The رَفيف air — drawn.
 *
 * رَفيف is the faint quiver of something light in moving air. The first
 * backdrop was a fetched bundle of lines that sat in a strip at the top of the
 * page and left the rest a wash, and the owner asked for more. You cannot
 * draw air, but you can draw the two things that show it: FEATHERS, drifting
 * down and turning as they fall, and the CURRENTS they ride — long parallel
 * lines that run across the page and slide slowly through it.
 *
 * Everything is SVG/CSS; only transform and opacity animate. Under reduced
 * motion the feathers hang in the air and the currents hold still.
 */

/** One feather: a curved shaft, a vane on each side notched a little the way
 *  a real vane splits, and an afterfeather at the base. viewBox 0 0 60 150. */
function Feather({ n }: { n: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <svg className="air-feather" data-feather={n} viewBox="0 0 60 150" aria-hidden="true" focusable="false">
      {/* Outer vane. */}
      <path
        className="air-vane"
        d="M30 6 C 44 18, 54 44, 52 76 C 51 98, 44 116, 34 132 L 31 130 L 32 118 L 29 116 L 31 104 L 28 102 L 30 90 L 27 88 L 29 76 L 26 74 L 28 60 L 26 58 L 28 40 L 30 6 Z"
      />
      {/* Inner vane, narrower and a shade lighter. */}
      <path
        className="air-vane-inner"
        d="M30 6 C 20 20, 12 44, 12 74 C 12 96, 18 114, 26 130 L 29 128 L 27 116 L 30 114 L 28 102 L 31 100 L 29 88 L 32 86 L 30 74 L 33 72 L 31 58 L 33 56 L 31 40 L 30 6 Z"
      />
      {/* The shaft, from tip to quill. */}
      <path className="air-shaft" d="M30 6 C 31 40, 30 90, 30 148" />
      {/* Afterfeather: a few soft strands at the base. */}
      <path className="air-down" d="M30 122 c -6 4, -10 10, -12 18 M30 126 c 5 4, 9 9, 10 16 M30 118 c -8 2, -12 6, -14 12" />
    </svg>
  )
}

/** A current: five parallel lines drawn over two periods, so a one-period
 *  slide loops without a seam. viewBox 0 0 2000 120, period 1000. */
function Current({ n }: { n: 1 | 2 | 3 }) {
  const lines = [0, 9, 18, 27, 36].map(
    (dy) => `M-20 ${60 + dy} C 200 ${20 + dy}, 380 ${20 + dy}, 520 ${60 + dy} S 860 ${100 + dy}, 1000 ${60 + dy} S 1360 ${20 + dy}, 1520 ${60 + dy} S 1860 ${100 + dy}, 2020 ${60 + dy}`
  )
  return (
    <svg className="air-current" data-current={n} viewBox="0 0 2000 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="air-current-lines">
        {lines.map((d, i) => (
          <path key={i} d={d} style={{ opacity: 1 - i * 0.16 }} />
        ))}
      </g>
    </svg>
  )
}

export function AirDrift() {
  return (
    <>
      <Current n={1} />
      <Current n={2} />
      <Current n={3} />
      <Feather n={1} />
      <Feather n={2} />
      <Feather n={3} />
      <Feather n={4} />
      <Feather n={5} />
    </>
  )
}
