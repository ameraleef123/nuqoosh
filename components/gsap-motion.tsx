'use client'

import { useEffect, type ReactNode } from 'react'
import {
  registerGsap,
  revealOnScroll,
  heroEntrance,
  splitWords,
  withMotion,
  watchVisibility,
  MOTION,
} from '@/lib/motion'
import { gsap } from 'gsap'

/**
 * GSAP lives ONLY in this module.
 *
 * It is deliberately not imported by `components/providers.tsx`, because the
 * root layout imports that file — a top-level `import { gsap }` there pulls the
 * whole library into the chunk shared by every route, including the public
 * page, which measured 186 KB First Load JS before this split.
 *
 * Builder routes import this component explicitly; the public page never does.
 */

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stopVisibility = watchVisibility()
    let mm: ReturnType<typeof withMotion> | null = null
    let revertSplit: (() => void) | null = null

    try {
      registerGsap()

      mm = withMotion(() => {
        // Signature 1 — hero entrance.
        const headline = document.querySelector<HTMLElement>('[data-hero-headline]')
        const heroItems = document.querySelectorAll('[data-hero]')

        const tl = gsap.timeline()

        if (headline) {
          const split = splitWords(headline)
          revertSplit = split.revert
          gsap.set(headline, { opacity: 1 })
          tl.fromTo(
            split.words,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: MOTION.dur.hero,
              ease: MOTION.ease.out,
              stagger: MOTION.stagger.words,
            },
            0
          )
        }

        if (heroItems.length) {
          tl.add(heroEntrance(heroItems), 0.1)
        }

        // Signature 2 — scroll reveal for every marked section.
        revealOnScroll(document.querySelectorAll('[data-reveal]'))
      })

      document.documentElement.dataset.motionReady = '1'
    } catch {
      // Motion is an enhancement layer. If it throws, content must still show.
      document.documentElement.classList.add('motion-failsafe')
    }

    return () => {
      stopVisibility()
      mm?.revert()
      revertSplit?.() // restore the original text node for assistive tech
    }
  }, [])

  return <>{children}</>
}

