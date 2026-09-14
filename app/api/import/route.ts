import { NextResponse } from 'next/server'
import { extractText, kindOf, MAX_BYTES } from '@/lib/import/extract'
import { parseCv } from '@/lib/import/parse'
import { profileSchema } from '@/lib/schema'

export const runtime = 'nodejs'

/**
 * POST multipart/form-data with a `file` field → { profile, found, unrecognised }.
 *
 * The file is read into memory, parsed, and dropped. Nothing is written to
 * disk or to any store here; the draft only exists once the student keeps it.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'ما وصل ملف.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'الملف أكبر من ٤ ميغابايت.' }, { status: 413 })
  }
  const kind = kindOf(file.name, file.type)
  if (!kind) {
    return NextResponse.json({ error: 'بنقبل PDF أو DOCX بس.' }, { status: 415 })
  }

  let text: string
  try {
    text = await extractText(Buffer.from(await file.arrayBuffer()), kind)
  } catch (err) {
    // The student gets a plain hint; the cause goes to the server log where
    // someone can act on it.
    console.error('[import] extract failed:', err)
    return NextResponse.json({ error: 'ما قدرنا نقرأ الملف. جرّب تصدّره من جديد كـ PDF.' }, { status: 422 })
  }

  if (text.replace(/\s/g, '').length < 40) {
    return NextResponse.json(
      { error: 'الملف ما فيه نصّ يُقرأ — غالبًا صورة ممسوحة. جرّب ملف PDF مصدّرًا من Word أو Google Docs.' },
      { status: 422 }
    )
  }

  // Dev-only: ?raw=1 returns the extracted text, so parser rules can be
  // written against what the reader actually produces.
  if (process.env.NODE_ENV !== 'production' && new URL(req.url).searchParams.get('raw') === '1') {
    return NextResponse.json({ text })
  }

  const result = parseCv(text)
  const checked = profileSchema.safeParse(result.profile)
  if (!checked.success) {
    // The parser produced something the schema rejects: a bug, not user error.
    return NextResponse.json({ error: 'صار خطأ داخلي وقت الفهم.', issues: checked.error.issues }, { status: 500 })
  }

  return NextResponse.json({ profile: checked.data, found: result.found, unrecognised: result.unrecognised })
}
