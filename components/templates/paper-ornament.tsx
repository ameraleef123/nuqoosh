/**
 * The ورقة divider — a manuscript rosette between two hairlines.
 *
 * Arabic books have divided a heading from its text this way for centuries,
 * and it solves a problem the Latin templates solve with a drop cap: Arabic
 * letters join, so the first letter of a paragraph cannot be pulled out and
 * enlarged. The ornament carries that decorative weight instead.
 *
 * Drawn rather than typed. The rosette characters (۞ and friends) render
 * differently in every face and are missing from several of ours, while this
 * is 300 bytes, scales to any size and inherits `currentColor`. It is
 * symmetric, so it needs no RTL variant, and the hairlines fade out through a
 * CSS mask (effects.css) rather than a gradient, so there is no id to collide
 * when a page renders more than one.
 */
export function PaperOrnament({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 24"
      className={`paper-ornament ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M2 12H86" />
        <path d="M134 12H218" />
        {/* The rosette: a diamond inside a diamond, the way a carved one is cut. */}
        <path d="M110 3.5 117 12 110 20.5 103 12Z" />
        <path d="M110 7.5 113.5 12 110 16.5 106.5 12Z" />
      </g>
      <g fill="currentColor">
        <circle cx="94" cy="12" r="1.5" />
        <circle cx="126" cy="12" r="1.5" />
      </g>
    </svg>
  )
}
