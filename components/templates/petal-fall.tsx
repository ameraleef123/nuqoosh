/**
 * The ساكورا petal fall — drawn petals, not a fetched animation.
 *
 * This started as `petals.lottie` from the free catalogue, and the art looked
 * right. It was the cost that was wrong. That file is 169 KB of JSON with every
 * position baked frame by frame — 2160 keyframes across 18 layers — and because
 * its petals are sized as a fraction of the composition, it only looks correct
 * at about 430px wide, which means three copies to cross a desktop viewport.
 * Three players cost 3.6 seconds of main thread per 5 seconds of scrolling
 * (measured with scripts/perf.mjs); the page was busy 72% of the time and it
 * showed as a stutter.
 *
 * Falling petals do not need a player. Every property below is `transform` and
 * `opacity`, which the compositor animates off the main thread, so this layer
 * costs essentially nothing no matter how long it runs. Twenty petals, one
 * shared SVG path, about 1.5 KB of markup.
 *
 * The colours are the ones the old art used (#ffb7b7 through #f57e7e), kept
 * deliberately: the footer's contrast was measured against those two ends and
 * the measurement still stands.
 */

/** Cherry petals are notched at the tip — that notch is what separates a sakura
 *  petal from a generic leaf, so it is worth the four extra curve points. */
const PETAL =
  'M10 24C3.2 19.2 0.4 11.6 2.6 5.6 4 1.8 7.2 0.4 10 3.4 12.8 0.4 16 1.8 17.4 5.6 19.6 11.6 16.8 19.2 10 24Z'

/** start inline %, size px, seconds, delay, drift px, spin turns, tone
 *  Sizes run 16-36px: the first pass used 9-20 and the petals read as dust on
 *  a near-white page. Tones lean on the two deeper pinks for the same reason —
 *  the palest one only shows against the night. */
const PETALS = [
  [2, 24, 19, -2, 70, 1, 1],
  [8, 17, 26, -9, -50, -1, 2],
  [14, 31, 16, -5, 110, 1, 0],
  [20, 19, 23, -14, -30, 2, 2],
  [26, 27, 21, -1, 60, -1, 1],
  [32, 16, 28, -18, -90, 1, 2],
  [38, 34, 17, -7, 40, -2, 0],
  [44, 21, 24, -12, 85, 1, 1],
  [50, 28, 20, -3, -60, -1, 2],
  [56, 18, 27, -21, 100, 1, 1],
  [62, 33, 18, -8, -40, 2, 0],
  [68, 22, 22, -16, 75, -1, 2],
  [73, 26, 25, -6, -80, 1, 1],
  [79, 17, 19, -11, 50, -2, 2],
  [84, 30, 23, -19, -70, 1, 0],
  [89, 20, 17, -4, 90, -1, 1],
  [93, 25, 29, -23, -55, 2, 2],
  [97, 18, 21, -13, 45, 1, 1],
  [99, 32, 26, -17, -95, -1, 0],
  [5, 21, 24, -25, 65, 1, 2],
] as const

export function PetalFall() {
  return (
    <div className="petal-fall" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }} focusable="false">
        <defs>
          <path id="sakura-petal" d={PETAL} />
        </defs>
      </svg>
      {PETALS.map(([x, size, dur, delay, drift, spin, tone], i) => (
        <svg
          key={i}
          className="petal"
          data-tone={tone}
          viewBox="0 0 20 24"
          style={
            {
              insetInlineStart: `${x}%`,
              inlineSize: `${size}px`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              '--drift': `${drift}px`,
              '--spin': `${spin}turn`,
            } as React.CSSProperties
          }
          focusable="false"
        >
          <use href="#sakura-petal" />
        </svg>
      ))}
    </div>
  )
}
