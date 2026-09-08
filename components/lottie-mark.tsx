'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { DotLottie } from '@lottiefiles/dotlottie-react'

/**
 * A Lottie animation that cannot hurt the page it sits on.
 *
 * The public page has a 120 KB gz JavaScript budget and it is already at 119 KB,
 * so the player must never be part of the first load. Three rules make that
 * true, and they are the same rules the rest of the motion layer follows:
 *
 *  1. The player is a dynamic import, so it lands in its own chunk rather than
 *     in First Load JS. The page is readable long before it arrives.
 *  2. It is only fetched once the animation is near the viewport, so a visitor
 *     who never scrolls that far never pays for it. This matters most for the
 *     card animation, which is 494 KB because it has three PNGs baked in.
 *  3. Under `prefers-reduced-motion: reduce` it is never fetched at all and the
 *     poster stays. Not a slower animation — no animation, and no download.
 *
 * It also pauses when scrolled out of view or when the tab is hidden, so an
 * offscreen loop never burns a phone battery.
 */

/**
 * The player is WebAssembly, and by default it fetches its .wasm from
 * cdn.jsdelivr.net at runtime. That sends every visitor's IP to a third party
 * and puts a CDN outage between a student's page and its art, so the binary is
 * copied into public/lottie and pointed at from here. Self-hosting is also why
 * this import has to resolve the module before rendering: setWasmUrl has to run
 * before the first player instance is constructed.
 */
const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then((m) => {
      m.setWasmUrl('/lottie/dotlottie-player.wasm')
      return m.DotLottieReact
    }),
  { ssr: false, loading: () => null }
)

export function LottieMark({
  src,
  className,
  style,
  loop = true,
  /** Rendered until the animation loads, and forever under reduced motion. */
  poster,
  label,
}: {
  src: string
  className?: string
  style?: React.CSSProperties
  loop?: boolean
  poster?: React.ReactNode
  /** Give a label only if the animation carries meaning; decoration stays hidden. */
  label?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)
  const [player, setPlayer] = useState<DotLottie | null>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        // Start fetching a little before it is on screen so it is ready in time.
        if (entry.isIntersecting) setShouldLoad(true)
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Pause offscreen and when the tab is hidden.
  useEffect(() => {
    if (!player) return
    const apply = () => {
      if (inView && !document.hidden) player.play()
      else player.pause()
    }
    apply()
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
  }, [player, inView])

  return (
    <div
      ref={box}
      className={className}
      style={style}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {shouldLoad ? (
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay
          dotLottieRefCallback={setPlayer}
          style={{ inlineSize: '100%', blockSize: '100%' }}
        />
      ) : (
        poster
      )}
    </div>
  )
}
