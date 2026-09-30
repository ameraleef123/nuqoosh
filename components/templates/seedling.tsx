/**
 * بادِرة — the seedling in the hero. Drawn.
 *
 * The first hero was a line-art hand from the catalogue: clip art, not a
 * place. The word means the first green that breaks the soil, and the first
 * sign of what someone will become, so the hero is now a seedling growing out
 * of a bed of soil on the card's floor, with the portrait as the bud at the
 * top of its stem — the art is attached to the person, the way سِيق, مُحيط
 * and نسيم do it.
 *
 * It GROWS once on load (the roots and stem draw themselves, the leaves
 * unfold, the sepals open, the bud appears) and then sways. Under reduced
 * motion it is simply there, fully grown. The page behind it keeps its wheat
 * field — the owner preferred it to a drawn garden.
 */

/**
 * The seedling in the hero. viewBox 200x260: soil across the foot, roots under
 * it, a stem rising to y=58 where the bud (the portrait, placed by CSS) opens
 * between two sepals. `pathLength="1"` on the stem and roots lets the CSS grow
 * them with a dash offset that does not depend on their real length.
 */
export function Seedling() {
  return (
    <svg className="seed-plant" viewBox="0 0 200 260" aria-hidden="true" focusable="false">
      {/* The bed. */}
      <rect className="seed-soil" x="14" y="212" width="172" height="48" rx="16" />
      <ellipse className="seed-soil-top" cx="100" cy="214" rx="86" ry="11" />

      {/* Roots, under the surface. */}
      <g className="seed-roots">
        <path className="seed-root" pathLength={1} d="M100 216 C 96 226, 84 232, 72 240" />
        <path className="seed-root" pathLength={1} d="M100 216 C 102 230, 108 238, 120 246" />
        <path className="seed-root" pathLength={1} d="M100 216 C 99 228, 96 240, 94 252" />
      </g>

      {/* The stem. */}
      <path className="seed-stem" pathLength={1} d="M100 214 C 105 184, 93 152, 100 120 C 105 98, 97 78, 100 60" />

      {/* Cotyledons: the first pair of leaves. */}
      <g className="seed-leaf" data-leaf="1">
        <path className="seed-leaf-body" d="M99 152 C 76 150, 56 132, 58 110 C 80 110, 98 128, 99 152 Z" />
        <path className="seed-vein" d="M97 148 C 86 138, 74 126, 64 116" />
      </g>
      <g className="seed-leaf" data-leaf="2">
        <path className="seed-leaf-body" d="M101 152 C 124 150, 144 132, 142 110 C 120 110, 102 128, 101 152 Z" />
        <path className="seed-vein" d="M103 148 C 114 138, 126 126, 136 116" />
      </g>
      {/* Sepals cupping the bud. The portrait sits over their top; their tips
          show under it, which is what makes the circle read as a bud. */}
      <g className="seed-sepals">
        <path className="seed-leaf-body" d="M100 68 C 80 72, 66 92, 74 116 C 90 106, 100 90, 100 68 Z" />
        <path className="seed-leaf-body" d="M100 68 C 120 72, 134 92, 126 116 C 110 106, 100 90, 100 68 Z" />
      </g>
    </svg>
  )
}
