/**
 * The فجر sun — first light rising behind the hero.
 *
 * Drawn, not fetched: the free Lottie catalog only had cartoon suns. A radial
 * gradient disc with a soft halo, risen by a one-shot transform on load and
 * kept alive by a slow opacity breathe on the halo. Both are transform/opacity
 * only, both stop under reduced motion (the disc is rendered already risen),
 * and the whole thing is about 300 bytes of CSS. Server component.
 */
export function DawnSun() {
  return (
    <div className="dawn-sun" aria-hidden="true">
      <div className="dawn-sun-halo" />
      <div className="dawn-sun-disc" />
    </div>
  )
}
