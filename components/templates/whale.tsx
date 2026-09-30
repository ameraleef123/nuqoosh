/**
 * مُحيط — a blue whale behind the porthole. Drawn, at the owner's request in
 * place of the fetched jellyfish.
 *
 * The whale is bigger than the pane, so what you see through the glass is a
 * whale PASSING: it swims across on a slow loop, its flukes beat, and its
 * baleen mouth and the long white belly say blue whale rather than fish. One
 * silhouette in three tones, in a 400x160 box.
 */
export function BlueWhale() {
  return (
    <svg className="whale" viewBox="0 0 400 160" aria-hidden="true" focusable="false">
      {/* The flukes, on their own group so they can beat. */}
      <g className="whale-flukes">
        <path className="whale-body" d="M40 78 C 22 60, 8 52, 0 46 C 14 66, 14 90, 0 112 C 8 104, 22 96, 40 82 Z" />
      </g>
      {/* The body: a long taper from the flukes to the rostrum, the dorsal
          fin small and far back, the way it is on the real animal. */}
      <path
        className="whale-body"
        d="M38 80 C 70 60, 130 44, 200 46 C 270 48, 330 58, 380 86 C 390 92, 392 100, 380 106 C 330 122, 260 128, 190 122 C 120 116, 70 104, 38 80 Z"
      />
      <path className="whale-body" d="M118 60 C 122 50, 130 48, 134 56 C 128 58, 122 60, 118 60 Z" />
      {/* The belly: pale, with the throat grooves that run from chin to navel. */}
      <path className="whale-belly" d="M60 92 C 120 116, 240 124, 372 102 C 330 118, 250 126, 190 122 C 130 118, 90 108, 60 92 Z" />
      <g className="whale-grooves">
        <path d="M250 112 C 300 114, 340 108, 372 100" />
        <path d="M240 118 C 300 120, 344 114, 376 104" />
        <path d="M228 122 C 296 124, 346 118, 378 108" />
      </g>
      {/* The flipper. */}
      <path className="whale-fin" d="M232 104 C 250 118, 262 134, 254 142 C 240 134, 226 120, 218 108 Z" />
      {/* The eye, small and low, just above the jawline. */}
      <circle className="whale-eye" cx="344" cy="86" r="2.6" />
      {/* Blowhole spray, faint. */}
      <g className="whale-spray">
        <circle cx="300" cy="44" r="2" />
        <circle cx="306" cy="36" r="1.6" />
        <circle cx="298" cy="30" r="1.2" />
      </g>
    </svg>
  )
}
