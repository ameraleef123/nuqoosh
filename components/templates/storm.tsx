/**
 * The تسلا storm — drawn lightning, and the flash that comes with it.
 *
 * Drawn rather than fetched, for the same reason مُحيط's wreck is: the free
 * catalogue's entire stock of "lightning" is cartoon bolts, weather icons and
 * physics diagrams. None of them looks like the thing.
 *
 * What makes a bolt read as real is not its silhouette, it is the layering:
 *
 *   1. a wide, soft, coloured halo around the channel
 *   2. a narrower, brighter sheath
 *   3. a hairline white-hot core
 *   4. forks that leave the channel and stop in mid-air
 *
 * and then the timing: a real strike is not one flash. It is a stutter of two
 * or three returns inside about a tenth of a second, and then nothing for
 * several seconds. The keyframes in effects.css do exactly that, and every
 * bolt runs on its own prime-numbered cycle so the storm never falls into
 * step with itself.
 *
 * Six bolts, one flash layer, about 2 KB of markup, and every animated
 * property is opacity.
 */

/** One channel: a jagged descent with a couple of forks leaving it. */
const CHANNELS = [
  'M52 0 40 26 55 31 34 62 49 66 28 104 44 100 22 150M55 31 72 44M34 62 14 76M44 100 62 118',
  'M30 0 46 30 32 36 54 70 38 74 58 112 42 116 60 150M54 70 74 82M38 74 18 92',
  'M60 0 44 24 58 30 36 58 52 64 30 96 46 102 26 150M36 58 16 66M46 102 66 112M58 30 76 22',
] as const

function Bolt({ channel, index }: { channel: string; index: number }) {
  return (
    <svg
      className="storm-bolt"
      data-bolt={index}
      viewBox="0 0 90 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* halo → sheath → core. Three strokes of one path, widest first. */}
      <path className="storm-halo" d={channel} />
      <path className="storm-sheath" d={channel} />
      <path className="storm-core" d={channel} />
    </svg>
  )
}

/** The background storm: bolts scattered across the viewport, plus the flash. */
export function Storm() {
  return (
    <div className="storm" aria-hidden="true">
      <span className="storm-flash" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Bolt key={i} channel={CHANNELS[i % CHANNELS.length]} index={i} />
      ))}
    </div>
  )
}
