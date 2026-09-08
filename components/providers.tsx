'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dirFor, DEFAULT_LANG, type Lang } from '@/lib/i18n'
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

/* ── Language ──────────────────────────────────────────────────────────────
   Same URL serves both languages (no /ar and /en routes). The toggle switches
   dir, lang, fonts, numerals, icon mirroring and content — per field.
   ────────────────────────────────────────────────────────────────────────── */

type LangContextValue = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void }
const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  toggle: () => {},
})

export function useLang() {
  return useContext(LangContext)
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  // The boot script may already have switched the document to English.
  useEffect(() => {
    const current = document.documentElement.getAttribute('lang')
    if (current === 'en') setLangState('en')
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    const el = document.documentElement
    el.setAttribute('lang', next)
    el.setAttribute('dir', dirFor(next))
    try {
      localStorage.setItem('nuqush-lang', next)
    } catch {
      /* private mode — the toggle still works for this session */
    }
  }, [])

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, toggle: () => setLang(lang === 'ar' ? 'en' : 'ar') }),
    [lang, setLang]
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/* ── Theme ─────────────────────────────────────────────────────────────────
   Three states: system (no attribute), light, dark. Both themes ship.
   ────────────────────────────────────────────────────────────────────────── */

export type Theme = 'system' | 'light' | 'dark'
type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void }
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'dark' || attr === 'light') setThemeState(attr)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    const el = document.documentElement
    if (next === 'system') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', next)
    try {
      if (next === 'system') localStorage.removeItem('nuqush-theme')
      else localStorage.setItem('nuqush-theme', next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/* ── Motion ────────────────────────────────────────────────────────────────
   The only place GSAP is booted. Under prefers-reduced-motion no tween is ever
   created, so the page is fully static rather than lightly animated.
   ────────────────────────────────────────────────────────────────────────── */

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

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <MotionProvider>{children}</MotionProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
