/**
 * The مُحيط floor — shafts of surface light, and a wreck resting on the bottom.
 *
 * Drawn, not fetched. The free catalogue's only sunken ship had bitmaps baked
 * into it, and its light-ray animations were worse: a baked sky rectangle that
 * would have painted a hard edge across the page. Both are cheaper here
 * anyway — the shafts are four gradients and the wreck is one SVG path set,
 * so they scale to any viewport, take the page's own colours, and cost nothing
 * to download. Same reasoning as DawnSun.
 *
 * Everything moves on transform or opacity only, inside a reduced-motion
 * guard, and pauses with the rest of the page when the tab is hidden.
 */

export function DeepWater() {
  return (
    <>
      {/* Light coming down from the surface. Four shafts at different widths
          and angles so they read as one diffuse source rather than a pattern. */}
      <div className="deep-shafts" aria-hidden="true">
        <span className="deep-shaft" data-shaft="1" />
        <span className="deep-shaft" data-shaft="2" />
        <span className="deep-shaft" data-shaft="3" />
        <span className="deep-shaft" data-shaft="4" />
      </div>

      <SunkenShip />
    </>
  )
}

/**
 * The wreck: a hull broken at the stern, listing to port, half-settled into
 * the seabed with its mast snapped. It is a silhouette in one colour — detail
 * would be a lie at this depth, where the only thing reaching it is the light
 * from the shafts above.
 */
function SunkenShip() {
  return (
    <svg
      className="deep-wreck"
      viewBox="0 0 900 300"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* The seabed it has settled into. */}
      <path
        className="deep-bed"
        d="M0 246c96-22 168-12 262-18 104-7 168 12 274 6 92-5 150 14 232 4 52-6 96-14 132-22v84H0Z"
      />

      <g className="deep-hull" transform="rotate(-6 450 210)">
        {/* Hull: square stern on the left, raised bow on the right, the whole
            thing sunk into the bed by about a third of its depth. */}
        <path d="M232 176h398c34 0 58 8 70 20-12 26-52 44-114 50l-292 8c-52 1-84-20-90-56 0-14 10-22 28-22Z" />
        {/* The deck line, a shade lighter so the hull does not read as a blob. */}
        <path className="deep-deck" d="M232 176h398c34 0 58 8 70 20H236Z" />
        {/* The break at the stern: a wedge of missing plating. */}
        <path className="deep-gap" d="M288 196l34 42-56-4-14-38Z" />
        {/* A snapped mast, and the spar still hanging off it. */}
        <g className="deep-rig">
          <path d="M452 176 470 62" />
          <path d="M470 84 534 102" />
          <path d="M464 116 402 140" />
        </g>
        {/* Portholes, the one detail that says ship rather than rock. */}
        <g className="deep-ports">
          <circle cx="330" cy="212" r="7" />
          <circle cx="392" cy="214" r="7" />
          <circle cx="454" cy="215" r="7" />
        </g>
      </g>
    </svg>
  )
}
