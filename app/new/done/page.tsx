'use client'

/**
 * `/new/done` — the page is live. Three things, in this order of importance:
 * the link (Arabic, with its Latin twin), a QR to put on a CV or a badge, and
 * the edit link — shown here and kept on this device, never recoverable from
 * us, so the copy says so plainly.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, ExternalLink, KeyRound, Share2 } from 'lucide-react'
import QRCode from 'qrcode'
import { Glass, Mesh, Wordmark } from '@/components/ui'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { loadDraft, type Draft } from '@/lib/draft'

function useOrigin() {
  const [origin, setOrigin] = useState('')
  useEffect(() => setOrigin(window.location.origin), [])
  return origin
}

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setDone(true)
          setTimeout(() => setDone(false), 1800)
        } catch {
          /* older WebView: the field is selectable, the student can long-press */
        }
      }}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[var(--nq-radius-md)] border border-[var(--nq-border-strong)] px-3 text-sm font-medium"
      aria-live="polite"
    >
      {done ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {done ? 'انسخنا' : 'انسخ'}
    </button>
  )
}

function LinkRow({ href }: { href: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener"
        dir="ltr"
        className="min-w-0 flex-1 truncate rounded-[var(--nq-radius-md)] border border-[var(--nq-border)] px-3 py-2.5 font-mono text-sm underline-offset-4 hover:underline"
      >
        {href}
      </a>
      <CopyButton value={href} />
    </div>
  )
}

export default function DonePage() {
  const origin = useOrigin()
  const [draft, setDraft] = useState<Draft | null | undefined>(undefined)
  const [qr, setQr] = useState<string>('')

  useEffect(() => setDraft(loadDraft()), [])

  const pub = draft?.published
  const arUrl = pub && origin ? `${origin}/${pub.handle}` : ''
  const laUrl = pub && origin ? `${origin}/${pub.latinHandle}` : ''
  const editUrl = pub && origin ? `${origin}/edit/${pub.id}#${pub.editToken}` : ''

  useEffect(() => {
    if (!laUrl) return
    // The Latin link goes in the QR: shorter payload, and every scanner app
    // shows it correctly before opening. Generated here; nothing leaves the browser.
    QRCode.toDataURL(laUrl, { margin: 1, width: 512, errorCorrectionLevel: 'M' })
      .then(setQr)
      .catch(() => setQr(''))
  }, [laUrl])

  if (draft === undefined) return null
  if (!pub) {
    return (
      <main className="container-page py-20 text-center">
        <p className="mb-4 text-lg">ما في صفحة منشورة على هالجهاز.</p>
        <Link href="/new" className="underline underline-offset-4">
          ابدأ من هون
        </Link>
      </main>
    )
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

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

      <main className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="mb-2 text-[clamp(2rem,5vw,3rem)] font-extrabold">صفحتك صارت على النت</h1>
            <p className="text-[var(--nq-muted-foreground)] text-lg">
              هاد رابطك. ابعته بالواتساب، حطّه بسيرتك، أو خلّي الـ QR على بطاقتك.
            </p>
          </div>

          <Glass intensity="strong" className="space-y-3 p-5">
            <h2 className="font-bold">الرابط</h2>
            <LinkRow href={arUrl} />
            {/* A Latin-only name has one handle, not a pair. */}
            {pub.handle !== pub.latinHandle ? (
              <>
                <LinkRow href={laUrl} />
                <p className="text-[var(--nq-muted-foreground)] text-sm">
                  الاثنين نفس الصفحة. العربي للناس، واللاتيني للتطبيقات اللي بتخرّب الروابط العربية.
                </p>
              </>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={arUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--nq-radius-md)] px-5 font-semibold"
                style={{ background: 'var(--nq-accent)', color: 'var(--nq-on-accent)' }}
              >
                <ExternalLink size={17} aria-hidden="true" />
                افتح صفحتك
              </a>
              {canShare ? (
                <button
                  type="button"
                  onClick={() => navigator.share({ url: laUrl }).catch(() => {})}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[var(--nq-radius-md)] border border-[var(--nq-border-strong)] px-5 font-medium"
                >
                  <Share2 size={17} aria-hidden="true" />
                  شارك
                </button>
              ) : null}
            </div>
          </Glass>

          <Glass className="flex flex-wrap items-center gap-5 p-5">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element -- data: URI, no optimisation possible
              <img
                src={qr}
                alt={`رمز QR لرابط ${laUrl}`}
                width={160}
                height={160}
                className="rounded-[var(--nq-radius-md)] bg-white p-2"
              />
            ) : (
              <div className="size-40 rounded-[var(--nq-radius-md)] border border-[var(--nq-border)]" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="font-bold">QR</h2>
              <p className="text-[var(--nq-muted-foreground)] text-sm">
                اضغط مطوّلًا على الصورة واحفظها، أو اطبعها على سيرتك الورقية.
              </p>
              {qr ? (
                <a
                  href={qr}
                  download={`nuqush-${pub.latinHandle}.png`}
                  className="inline-flex min-h-11 items-center rounded-[var(--nq-radius-md)] border border-[var(--nq-border-strong)] px-4 text-sm font-medium"
                >
                  نزّل الصورة
                </a>
              ) : null}
            </div>
          </Glass>

          <Glass className="space-y-3 border border-[var(--nq-border-strong)] p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <KeyRound size={18} aria-hidden="true" />
              رابط التعديل
            </h2>
            <LinkRow href={editUrl} />
            <p className="text-[var(--nq-muted-foreground)] text-sm">
              احفظه بمكان آمن — ابعته لحالك على الواتساب مثلًا. هو الطريقة الوحيدة لتعديل صفحتك من جهاز
              ثاني، وإحنا ما بنخزّنه، فما بنقدر نرجّعه إذا ضاع. على هالجهاز بتقدر تعدّل مباشرة من{' '}
              <Link href="/new/review" className="underline underline-offset-4">
                المراجعة
              </Link>
              .
            </p>
          </Glass>
        </div>
      </main>
    </>
  )
}
