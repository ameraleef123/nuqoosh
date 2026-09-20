'use client'

/**
 * `/edit/{id}#{token}` — the edit link from the done page, opened on any
 * device. The token rides in the URL fragment so it never reaches a server
 * log; the page swaps it for the live profile, stores both as the local
 * draft, and hands over to the review where «حدّث الصفحة» works.
 */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { foundFromProfile, saveDraft } from '@/lib/draft'

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [hint, setHint] = useState<string | null>(null)

  useEffect(() => {
    const token = window.location.hash.slice(1)
    if (!token) {
      setHint('رابط التعديل ناقص. انسخه كامل من الرسالة اللي حفظته فيها.')
      return
    }
    fetch(`/api/profiles/${id}`, { headers: { 'x-edit-token': token } })
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'ما زبطت.')
        saveDraft({
          profile: json.profile,
          found: foundFromProfile(json.profile),
          unrecognised: [],
          importedAt: new Date().toISOString(),
          published: {
            id,
            handle: json.profile.handle,
            latinHandle: json.profile.latinHandle,
            editToken: token,
            publishedAt: new Date().toISOString(),
          },
        })
        router.replace('/new/review')
      })
      .catch((err: Error) => setHint(err.message))
  }, [id, router])

  return (
    <main className="container-page py-20 text-center">
      {hint ? (
        <>
          <p className="mb-4 text-lg" role="status">
            {hint}
          </p>
          <Link href="/new" className="underline underline-offset-4">
            ابدأ صفحة جديدة
          </Link>
        </>
      ) : (
        <p className="text-lg" aria-live="polite">
          عم نفتح صفحتك…
        </p>
      )}
    </main>
  )
}
