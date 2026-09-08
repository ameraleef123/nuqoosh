'use client'

import { Languages, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLang, useTheme } from './providers'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/cn'

const BTN =
  'inline-flex items-center justify-center gap-2 min-h-11 min-w-11 px-3 rounded-[var(--nq-radius-md)] ' +
  'text-sm font-medium border border-[var(--nq-border)] bg-[var(--glass-bg-subtle)] ' +
  'transition-colors duration-200 hover:border-[var(--nq-border-strong)] cursor-pointer'

/** One click switches dir, lang, fonts, numerals, icon mirroring and content. */
export function LangToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang()
  return (
    <button type="button" onClick={toggle} className={cn(BTN, className)} lang={lang === 'ar' ? 'en' : 'ar'}>
      <Languages size={18} aria-hidden="true" />
      <span>{t('toggleLang', lang)}</span>
    </button>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const { lang } = useLang()
  const [isDark, setIsDark] = useState(false)

  // Resolve `system` against the real media query, and follow it while it lasts.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const resolve = () => setIsDark(theme === 'dark' || (theme === 'system' && mq.matches))
    resolve()
    mq.addEventListener('change', resolve)
    return () => mq.removeEventListener('change', resolve)
  }, [theme])

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(BTN, className)}
      aria-label={t('toggleTheme', lang)}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
