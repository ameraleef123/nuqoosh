/**
 * صقيع — ice in the hero. Drawn.
 *
 * The first hero was a portrait, the writing, and a fetched winter tree (a
 * 494 KB Lottie with three PNGs baked in). The owner asked for more. What
 * frost actually does to a window is the identity here: ICICLES hang from
 * the card's top edge, FROST FERNS grow in from its corners, snowflakes fall
 * inside it, and the portrait sits in a ring of ice — a pane cleared with a
 * glove, the frost still crusted round its rim.
 *
 * SVG and CSS; flakes fall on transform, the ferns and icicles are static.
 */

/** A frost fern: a main vein with side branches shortening toward the tip,
 *  each branch carrying its own smaller branches. */
function fern(len: number, seed: number) {
  const parts: string[] = [`M0 0 L ${len} 0`]
  const n = 7
  for (let i = 1; i <= n; i++) {
    const x = (i * len) / (n + 1)
    const l = (len / 3) * (1 - i / (n + 1)) * (0.8 + ((seed * 7 + i * 13) % 5) / 10)
    for (const s of [1, -1]) {
      const ex = x + l * 0.7
      const ey = s * l * 0.7
      parts.push(`M${x} 0 L ${ex} ${ey}`)
      // sub-branches
      parts.push(`M${x + l * 0.3} ${s * l * 0.3} L ${x + l * 0.3 + l * 0.25} ${s * l * 0.3 - s * l * 0.02}`)
      parts.push(`M${x + l * 0.5} ${s * l * 0.5} L ${x + l * 0.5 + l * 0.22} ${s * l * 0.5 + s * l * 0.1}`)
    }
  }
  return parts.join(' ')
}

export function FrostCorner({ corner }: { corner: 'start' | 'end' }) {
  return (
    <svg className="frost-fern" data-corner={corner} viewBox="-10 -70 200 140" aria-hidden="true" focusable="false">
      <g className="frost-fern-lines">
        <path d={fern(150, 1)} transform="rotate(12)" />
        <path d={fern(120, 2)} transform="rotate(-28)" />
        <path d={fern(96, 3)} transform="rotate(48)" />
        <path d={fern(70, 4)} transform="rotate(-62)" />
      </g>
    </svg>
  )
}

/** Icicles along the card's top edge: a run of tapering drops, uneven. */
export function Icicles() {
  const W = 1200
  const drops: string[] = []
  let x = 6
  let i = 0
  while (x < W) {
    const w = 10 + ((i * 7) % 5) * 4
    const h = 18 + ((i * 13) % 7) * 9
    drops.push(`M${x} 0 Q ${x + w * 0.1} ${h * 0.55} ${x + w / 2} ${h} Q ${x + w * 0.9} ${h * 0.55} ${x + w} 0 Z`)
    x += w + 6 + ((i * 5) % 4) * 6
    i++
  }
  return (
    <svg className="frost-icicles" viewBox={`0 0 ${W} 90`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="frost-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="frost-ice-a" />
          <stop offset="1" className="frost-ice-b" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={W} height="7" fill="url(#frost-ice)" />
      {drops.map((d, k) => (
        <path key={k} className="frost-drop" d={d} fill="url(#frost-ice)" />
      ))}
    </svg>
  )
}

/** A six-fold flake. */
function Flake({ n }: { n: number }) {
  return (
    <svg className="frost-flake" data-flake={n} viewBox="-12 -12 24 24" aria-hidden="true" focusable="false">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M-11 0 H 11 M-6 0 L -8 -2.5 M-6 0 L -8 2.5 M6 0 L 8 -2.5 M6 0 L 8 2.5 M-3 0 L -4.5 -2 M3 0 L 4.5 2" />
        </g>
      ))}
    </svg>
  )
}

export function Snowfall() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <Flake key={n} n={n} />
      ))}
    </>
  )
}
