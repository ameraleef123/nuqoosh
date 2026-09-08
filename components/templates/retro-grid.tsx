/**
 * Retro Grid — a perspective floor grid receding to the horizon.
 *
 * The Magic UI / 21st.dev "Retro Grid" pattern, written as plain CSS so it
 * ships zero JavaScript: a `rotateX`-tilted plane of repeating gradient lines,
 * scrolled by a transform-only keyframe. Fades into the page background at the
 * horizon via a mask, so it reads as ground meeting sky — which is why it lives
 * under the فجر (dawn) hero.
 *
 * Reduced motion stops the scroll; the grid stays as a static floor.
 * Server component: no client JS.
 */
export function RetroGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`retro-grid ${className}`} aria-hidden="true">
      <div className="retro-grid-plane">
        <div className="retro-grid-lines" />
      </div>
      <div className="retro-grid-fade" />
    </div>
  )
}
