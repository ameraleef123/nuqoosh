'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

/* ═══════════════════════════════════════════════════════════════════════════
   Motion tokens — the single source shared with CSS (app/globals.css).
   Only `transform` and `opacity` are ever animated. Never backdrop-filter,
   filter or box-shadow on scroll.
   ═══════════════════════════════════════════════════════════════════════════ */

export const MOTION = {
  dur: {
    hover: 0.2,
    reveal: 0.35,
    enter: 0.5,
    hero: 0.6,
    transition: 0.6,
    exit: 0.2, // exit always faster than entrance
  },
  ease: {
    out: 'expo.out',
    inOut: 'expo.inOut',
    soft: 'power1.out',
    standard: 'power2.out',
  },
  stagger: {
    chars: 0.015,
    words: 0.04,
    items: 0.03,
  },
} as const

let registered = false

/** Registers plugins exactly once. Safe to call from any client component. */
export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, Flip)
  registered = true
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The reduced-motion contract, in one place.
 *
 * `gsap.matchMedia` only runs the callback when the query matches, so under
 * `prefers-reduced-motion: reduce` **no tween is ever created** — the page is
 * fully static, not lightly animated. The matching CSS guard in globals.css
 * means the final state is what was rendered all along.
 *
 * Returns the matchMedia instance so callers can revert on unmount.
 */
export function withMotion(build: (ctx: gsap.Context) => void): gsap.MatchMedia {
  registerGsap()
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
    build(ctx as gsap.Context)
  })
  return mm
}

/* ── Signature 2: scroll reveal ────────────────────────────────────────────
   opacity 0→1, y 12px, 350ms, power1.out, play none none reverse.
   Small offset on purpose: it must read as a fade, not a slide.
   ────────────────────────────────────────────────────────────────────────── */
export function revealOnScroll(targets: Element[] | NodeListOf<Element>): void {
  const els = Array.from(targets)
  for (const el of els) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: MOTION.dur.reveal,
        ease: MOTION.ease.soft,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }
}

/* ── Signature 1: hero entrance ────────────────────────────────────────────
   Glass card rises 16px and fades. The name uses a word/char split handled by
   the caller (only headline-length copy, per the GSAP preset's own rule).
   ────────────────────────────────────────────────────────────────────────── */
export function heroEntrance(items: Element[] | NodeListOf<Element>): gsap.core.Timeline {
  const els = Array.from(items)
  const tl = gsap.timeline()
  tl.fromTo(
    els,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: MOTION.dur.hero,
      ease: MOTION.ease.out,
      stagger: MOTION.stagger.items,
    }
  )
  return tl
}

/**
 * Splits a short headline into per-word spans for staggered reveal.
 * Word-level, not character-level: Arabic is cursive, so splitting characters
 * breaks the joining forms and the word stops being readable.
 * Returns a revert function that restores the original text node.
 */
export function splitWords(el: HTMLElement): { words: HTMLElement[]; revert: () => void } {
  const original = el.innerHTML
  const source = el.textContent ?? ''
  const parts = source.split(/(\s+)/)
  el.textContent = ''
  const words: HTMLElement[] = []

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part))
      continue
    }
    if (!part) continue
    const span = document.createElement('span')
    span.textContent = part
    span.style.display = 'inline-block'
    span.style.willChange = 'transform, opacity'
    el.appendChild(span)
    words.push(span)
  }

  return {
    words,
    revert: () => {
      el.innerHTML = original
    },
  }
}

/* ── Signature 5: template switch ──────────────────────────────────────────
   FLIP on the shared hero card so the student sees continuity, not a reload.
   ────────────────────────────────────────────────────────────────────────── */
export function captureFlip(selector: string): Flip.FlipState | null {
  registerGsap()
  if (typeof document === 'undefined') return null
  if (!document.querySelector(selector)) return null
  return Flip.getState(selector)
}

export function playFlip(state: Flip.FlipState | null): void {
  if (!state || prefersReducedMotion()) return
  Flip.from(state, {
    duration: MOTION.dur.transition,
    ease: MOTION.ease.inOut,
    absolute: true,
    zIndex: 100,
  })
}

/* ── Signature 6: completion count-up ──────────────────────────────────────
   No preset existed in the skill's motion database for a counter; this is a
   stated default (see MASTER.md §2.5).
   ────────────────────────────────────────────────────────────────────────── */
export function countUp(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  duration = 0.6
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    onUpdate(to)
    return null
  }
  const proxy = { value: from }
  return gsap.to(proxy, {
    value: to,
    duration,
    ease: MOTION.ease.standard,
    onUpdate: () => onUpdate(Math.round(proxy.value)),
  })
}

/* ── Loop discipline ───────────────────────────────────────────────────────
   Every ambient loop pauses when the tab is hidden. Orb animation lives in CSS
   (transform-only keyframes); this flips the play state on the root element.
   ────────────────────────────────────────────────────────────────────────── */
export function watchVisibility(): () => void {
  if (typeof document === 'undefined') return () => {}
  const apply = () => {
    document.documentElement.dataset.motion = document.hidden ? 'paused' : 'running'
  }
  apply()
  document.addEventListener('visibilitychange', apply)
  return () => document.removeEventListener('visibilitychange', apply)
}
