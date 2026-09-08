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

/**
 * Theme and language only. `MotionProvider` (GSAP) is deliberately NOT composed
 * here: it would then load on the public page, where the measured framework
 * floor leaves no room for it. Builder routes opt in explicitly.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>{children}</LangProvider>
    </ThemeProvider>
  )
}
