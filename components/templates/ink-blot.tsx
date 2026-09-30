/**
 * The حبر page — a sheet of writing paper with ink on it. Drawn.
 *
 * The first backdrop was one small blot in a corner that breathed, on a flat
 * wash, and the owner asked for the background to be reworked. Ink needs
 * paper to be ink: so the page is now RULED like a writing sheet, with a
 * margin line down the start edge, and the ink on it is real ink — a long
 * reed-pen stroke sweeping across the top, pools that have bled into the
 * fibres (each pool is drawn twice, the second a little larger and fainter,
 * which is what a bleed looks like), and a few splatters.
 *
 * Everything is static except the pools, which swell very slowly on
 * `transform` — a blot on paper keeps spreading for a while. Under reduced
 * motion the ink is simply dry.
 */

const BLOT =
  'M104 18c22-4 44 10 54 30 8 16 4 30 14 44 12 17 14 40 2 58-14 21-42 30-66 24-15-4-26 6-42 4C36 174 14 152 12 124c-1-18 10-30 16-46 6-15 2-33 16-44 16-13 40-12 60-16z'

function Pool({ n }: { n: 1 | 2 | 3 }) {
  return (
    <svg className="ink-pool" data-pool={n} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {/* The bleed: the same shape, a shade larger and much fainter. */}
      <path className="ink-bleed" d={BLOT} transform="translate(100 100) scale(1.09) translate(-100 -100)" />
      <path className="ink-fill" d={BLOT} />
      <circle className="ink-fill" cx="152" cy="42" r="6" />
      <circle className="ink-fill" cx="30" cy="160" r="4" />
      <circle className="ink-fill" cx="168" cy="150" r="3" />
      <circle className="ink-fill" cx="176" cy="126" r="1.6" />
    </svg>
  )
}

export function InkPage() {
  return (
    <>
      {/* The sheet: horizontal rules and a margin line. */}
      <span className="ink-rules" />

      {/* A reed-pen stroke across the top of the page: thin where the pen
          landed, swelling through the sweep, lifting to a point. Two ihjam
          dots under it, because that is what a stroke on this paper gets. */}
      <svg className="ink-stroke" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <path
          className="ink-fill"
          d="M40 300 C 300 262, 520 150, 760 140 C 900 134, 1040 160, 1160 96 C 1070 200, 900 214, 760 206 C 540 200, 320 302, 40 312 Z"
        />
        <path className="ink-fill" d="M610 262 l14 -14 14 14 -14 14 z" />
        <path className="ink-fill" d="M650 268 l14 -14 14 14 -14 14 z" />
      </svg>

      <Pool n={1} />
      <Pool n={2} />
      <Pool n={3} />
    </>
  )
}
