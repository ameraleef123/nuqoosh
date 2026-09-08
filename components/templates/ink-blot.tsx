/**
 * The حبر mark — an ink blot that breathes.
 *
 * A hand-drawn SVG path so it stays crisp at any size and needs no font or
 * download. It sits in the page corner and scales very slowly (transform
 * only); under reduced motion it simply sits.
 */
export function InkBlot({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`ink-blot ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M104 18c22-4 44 10 54 30 8 16 4 30 14 44 12 17 14 40 2 58-14 21-42 30-66 24-15-4-26 6-42 4C36 174 14 152 12 124c-1-18 10-30 16-46 6-15 2-33 16-44 16-13 40-12 60-16z"
      />
      <circle cx="152" cy="42" r="6" fill="currentColor" />
      <circle cx="30" cy="160" r="4" fill="currentColor" />
      <circle cx="168" cy="150" r="3" fill="currentColor" />
    </svg>
  )
}
