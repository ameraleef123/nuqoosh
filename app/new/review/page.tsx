'use client'

/**
 * `/new/review` — "this is what we understood". The draft rendered in a real
 * template, with an honest line about what was and was not recognised, and a
 * strip to try the four templates on the student's own data.
 *
 * The wizard (Phase 3) replaces the "edit" button here with the six steps.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Rocket } from 'lucide-react'
import { TemplateRenderer } from '@/components/templates/renderer'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import { getTemplate, TEMPLATES } from '@/lib/templates'
import { loadDraft, saveDraft, type Draft } from '@/lib/draft'
import { cn } from '@/lib/cn'

const LABEL: Record<string, string> = {
  about: 'نبذة',
  education: 'الدراسة',
  projects: 'المشاريع',
  volunteering: 'التطوّع',
  activities: 'النشاطات',
  experience: 'الخبرة',
  skills: 'المهارات',
  links: 'التواصل',
}

export default function ReviewPage() {
  const { lang } = useLang()
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null | undefined>(undefined)
  const [publishing, setPublishing] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  useEffect(() => {
    setDraft(loadDraft())
  }, [])

  if (draft === undefined) return null
  if (draft === null) {
    return (
      <main className="container-page py-20 text-center">
        <p className="mb-4 text-lg">ما في مسوّدة على هالجهاز.</p>
        <Link href="/new" className="underline underline-offset-4">
          ارجع وارمي سيرتك
        </Link>
      </main>
    )
  }

  const template = getTemplate(draft.profile.templateId)
  const missing = Object.keys(LABEL).filter((k) => !draft.found.includes(k))

  const pick = (id: string) => {
    const next = { ...draft, profile: { ...draft.profile, templateId: id } }
    setDraft(next)
    saveDraft(next)
  }

  /**
   * One press. A first publish claims the handles and returns the edit token;
   * a later press on the same device updates the live page with that token.
   */
  const publish = async () => {
    setPublishing(true)
    setHint(null)
    try {
      const pub = draft.published
      const res = pub
        ? await fetch(`/api/profiles/${pub.id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json', 'x-edit-token': pub.editToken },
            body: JSON.stringify({ profile: draft.profile }),
          })
        : await fetch('/api/publish', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ profile: draft.profile }),
          })
      const json = await res.json()
      if (!res.ok) {
        setHint(json.error ?? 'ما زبطت. جرّب مرّة ثانية.')
        return
      }
      const published = pub
        ? { ...pub, publishedAt: new Date().toISOString() }
        : {
            id: json.id as string,
            handle: json.handle as string,
            latinHandle: json.latinHandle as string,
            editToken: json.editToken as string,
            publishedAt: new Date().toISOString(),
          }
      const next: Draft = {
        ...draft,
        profile: { ...draft.profile, handle: published.handle, latinHandle: published.latinHandle },
        published,
      }
      saveDraft(next)
      setDraft(next)
      router.push('/new/done')
    } catch {
      setHint('انقطع الاتصال. جرّب مرّة ثانية.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-strong)] backdrop-blur-md">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <Link href="/new" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium">
            <ArrowRight size={17} className="icon-flip" aria-hidden="true" />
            ملف ثاني
          </Link>

          <nav aria-label="تبديل القالب" className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => pick(tpl.id)}
                aria-pressed={tpl.id === template.id}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-[var(--nq-radius-md)] border px-3 text-sm font-medium transition-colors duration-200',
                  tpl.id === template.id ? 'border-transparent' : 'border-[var(--nq-border)] hover:border-[var(--nq-border-strong)]'
                )}
                style={tpl.id === template.id ? { background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' } : undefined}
              >
                {tpl.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void publish()}
              disabled={publishing}
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--nq-radius-md)] px-5 font-semibold transition-opacity duration-200 disabled:opacity-60"
              style={{ background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }}
            >
              <Rocket size={17} aria-hidden="true" />
              {publishing ? 'عم ننشر…' : draft.published ? 'حدّث الصفحة' : 'انشر'}
            </button>
          </div>
        </div>

        {/* The honesty line. Never "you are missing X" — just what we read. */}
        <div className="container-page text-[var(--nq-muted-foreground)] flex flex-wrap items-center gap-x-4 gap-y-1 pb-3 text-sm">
          <span>
            قرينا: {draft.found.filter((k) => LABEL[k]).map((k) => LABEL[k]).join('، ') || 'الاسم بس'}.
          </span>
          {missing.length ? <span>باقي بتعبّيه بالخطوات: {missing.map((k) => LABEL[k]).join('، ')}.</span> : null}
          {hint ? (
            <span role="status" className="basis-full">
              {hint}
            </span>
          ) : null}
        </div>
      </div>

      <TemplateRenderer profile={draft.profile} template={template} lang={lang} />
    </>
  )
}
