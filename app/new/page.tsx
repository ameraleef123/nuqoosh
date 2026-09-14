'use client'

/**
 * `/new` — the first screen. No account, no form yet: drop a CV, or start
 * from nothing. Either way the student ends up in the review with a draft.
 */

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Upload } from 'lucide-react'
import { Glass, Mesh, Wordmark } from '@/components/ui'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { saveDraft } from '@/lib/draft'
import { cn } from '@/lib/cn'

type State = { kind: 'idle' } | { kind: 'busy'; name: string } | { kind: 'error'; message: string }

export default function NewPage() {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [over, setOver] = useState(false)

  const submit = useCallback(
    async (file: File) => {
      setState({ kind: 'busy', name: file.name })
      const body = new FormData()
      body.append('file', file)
      try {
        const res = await fetch('/api/import', { method: 'POST', body })
        const json = await res.json()
        if (!res.ok) {
          setState({ kind: 'error', message: json.error ?? 'صار خطأ.' })
          return
        }
        saveDraft({ ...json, importedAt: new Date().toISOString() })
        router.push('/new/review')
      } catch {
        setState({ kind: 'error', message: 'انقطع الاتصال. جرّب مرّة ثانية.' })
      }
    },
    [router]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) void submit(f)
  }

  return (
    <>
      <Mesh />
      <header className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-subtle)] backdrop-blur-md">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Wordmark withLatin />
          </Link>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container-page py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-3 text-[clamp(2rem,5vw,3rem)] font-extrabold">ابدأ من سيرتك، أو من الصفر</h1>
          <p className="text-[var(--nq-muted-foreground)] mb-8 text-lg">
            ارمي ملف سيرتك هون وبنقرأه على جهازنا بلا ما نبعته لحدا. اللي بنفهمه بنعبّيه، واللي
            ما بنفهمه بتكمّله أنت بدقيقتين.
          </p>

          <Glass
            intensity="strong"
            className={cn(
              'relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-8 text-center transition-colors duration-200',
              over ? 'border-[var(--nq-accent)]' : 'border-[var(--nq-border-strong)]'
            )}
            role="button"
            tabIndex={0}
            aria-label="ارمي ملف السيرة هون أو اضغط لاختياره"
            onClick={() => input.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                input.current?.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
          >
            <input
              ref={input}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void submit(f)
              }}
            />

            {state.kind === 'busy' ? (
              <>
                <FileText size={40} aria-hidden="true" style={{ color: 'var(--nq-accent)' }} />
                <p className="font-semibold" aria-live="polite">
                  عم نقرأ {state.name}…
                </p>
              </>
            ) : (
              <>
                <Upload size={40} aria-hidden="true" style={{ color: 'var(--nq-accent)' }} />
                <p className="text-xl font-bold">ارمي سيرتك هون</p>
                <p className="text-[var(--nq-muted-foreground)] text-sm">PDF أو Word (docx) · لحدّ ٤ ميغابايت</p>
              </>
            )}
          </Glass>

          {state.kind === 'error' ? (
            // A hint, not a red wall: same colour as every other hint on the site.
            <p className="text-[var(--nq-muted-foreground)] mt-4" role="status">
              {state.message}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/preview/saqee"
              className="inline-flex min-h-11 items-center rounded-[var(--nq-radius-md)] border border-[var(--nq-border-strong)] px-5 font-medium"
            >
              أو ابدأ من الصفر
            </Link>
            <span className="text-[var(--nq-muted-foreground)] text-sm">بلا حساب. الرابط إلك للأبد.</span>
          </div>
        </div>
      </main>
    </>
  )
}
