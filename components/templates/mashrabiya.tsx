/**
 * The مَشرَبيّة lattice — drawn, and used at two sizes.
 *
 * A mashrabiya is a screen of turned wooden spindles set into a window: you
 * sit behind it and look out, and the light that gets through arrives cut into
 * pieces. That is the whole template. It is also, usefully, a PLACE WITH A
 * BODY — the portrait sits in an opening cut through the screen, the way سِيق
 * stands its portrait in a doorway and مُحيط puts one behind a porthole.
 *
 * The lattice is an SVG `<pattern>`, so the browser tiles it once and never
 * thinks about it again: no animation, no player, nothing per frame. It is
 * drawn as interlocking circles, which is what the turned spindles actually
 * make when they are assembled, rather than as a grid of stars — the circles
 * are what stop it reading as a generic geometric wallpaper.
 */

/** One tile of the screen. Circles on the corners and centre interlock with
 *  their neighbours across the tile edge, so the seam disappears. */
function LatticeDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
        <g className="lattice-line">
          <circle cx="0" cy="0" r="13" />
          <circle cx="40" cy="0" r="13" />
          <circle cx="0" cy="40" r="13" />
          <circle cx="40" cy="40" r="13" />
          <circle cx="20" cy="20" r="13" />
          {/* The pegs where four spindles meet. */}
          <rect x="18" y="-2" width="4" height="4" transform="rotate(45 20 0)" />
          <rect x="-2" y="18" width="4" height="4" transform="rotate(45 0 20)" />
          <rect x="38" y="18" width="4" height="4" transform="rotate(45 40 20)" />
          <rect x="18" y="38" width="4" height="4" transform="rotate(45 20 40)" />
        </g>
      </pattern>
    </defs>
  )
}

/** The screen behind the portrait in the hero. */
export function LatticePanel() {
  return (
    <svg className="lattice-panel" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <LatticeDefs id="mashrabiya-panel" />
      <rect width="100%" height="100%" fill="url(#mashrabiya-panel)" />
    </svg>
  )
}

/** The same screen across the whole page, far fainter — the room the page is
 *  in, rather than a decoration laid on top of it. */
export function LatticeWall() {
  return (
    <svg className="lattice-wall" aria-hidden="true" focusable="false">
      <LatticeDefs id="mashrabiya-wall" />
      <rect width="100%" height="100%" fill="url(#mashrabiya-wall)" />
    </svg>
  )
}

/**
 * The شمسة — the eight-fold rosette at the centre of a carved Mamluk panel.
 *
 * This was a fetched animation first, and it was the wrong KIND of thing: the
 * catalogue's rosettes are loaders, drawing and erasing themselves on a loop.
 * A rosette in a room is permanent — it is carved into the wood. So it is
 * constructed here from actual geometry (two star polygons and three circles,
 * points computed rather than eyeballed) and turns slowly enough that you have
 * to look twice to be sure it is turning at all.
 */
function star(points: number, outer: number, inner: number) {
  const p: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const a = (Math.PI * i) / points - Math.PI / 2
    const r = i % 2 ? inner : outer
    p.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return p.join(' ')
}

export function Rosette() {
  return (
    <svg className="rosette" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className="rosette-line">
        <circle cx="50" cy="50" r="47" />
        <circle cx="50" cy="50" r="38" />
        {/* The sixteen-fold ring of petals, and the eight-point star inside it
            — the two figures a شمسة is always built from. */}
        <polygon points={star(16, 38, 30)} />
        <polygon points={star(8, 30, 13)} />
        <circle cx="50" cy="50" r="11" />
        <polygon points={star(8, 11, 5)} />
      </g>
    </svg>
  )
}
