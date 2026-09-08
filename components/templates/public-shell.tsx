'use client'

import { TemplateRenderer } from './renderer'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import type { Profile } from '@/lib/schema'
import { getTemplate } from '@/lib/templates'

/**
 * The public page shell: the template plus the visitor's two controls.
 *
 * Language is client state because the same URL serves both languages — there
 * are no /ar and /en routes. The page is still prerendered to static HTML in
 * Arabic, so the first paint needs no JavaScript.
 */
export function PublicShell({ profile }: { profile: Profile }) {
  const { lang } = useLang()
  const template = getTemplate(profile.templateId)

  return (
    <>
      <div className="fixed inset-block-start-4 inset-inline-end-4 z-50 flex gap-2">
        <LangToggle />
        <ThemeToggle />
      </div>
      <TemplateRenderer profile={profile} template={template} lang={lang} />
    </>
  )
}
