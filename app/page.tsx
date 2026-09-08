'use client'

/**
 * Phase 1 — Foundations.
 *
 * This page exists to make the token layer verifiable in a browser: colours
 * with their measured contrast, the three glass surfaces over a live mesh, the
 * Arabic type scale, numerals switching with language, the six motion
 * signatures, and the two fixture profiles.
 *
 * It is NOT the landing page. The landing page is built later against
 * design-system/nuqush/pages/landing.md.
 */

import { useEffect, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { Glass, Reveal, SectionHeading, Wordmark } from '@/components/ui'
import { LangToggle, ThemeToggle } from '@/components/toggles'
import { useLang } from '@/components/providers'
import { fixtures } from '@/lib/fixtures'
import {
  completionAxes,
  completionPercent,
  hasSection,
  visibleSections,
  type Profile,
} from '@/lib/schema'
import { formatGpa, formatNumber, resolveField, t, ui, type Lang } from '@/lib/i18n'
import { countUp } from '@/lib/motion'

/* ── small helpers ─────────────────────────────────────────────────────── */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--nq-border)] py-2 last:border-0">
      <span className="text-[var(--nq-muted-foreground)] text-sm">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}

function Swatch({
  name,
  varName,
  ratio,
  onColor,
}: {
  name: string
  varName: string
  ratio: string
  onColor?: string
}) {
  return (
    <div className="overflow-hidden rounded-[var(--nq-radius-md)] border border-[var(--nq-border)]">
      <div
        className="flex min-h-16 items-center justify-center p-3 text-sm font-semibold"
        style={{ background: `var(${varName})`, color: onColor ? `var(${onColor})` : undefined }}
      >
        {onColor ? name : ''}
      </div>
      <div className="bg-[var(--glass-bg-subtle)] px-3 py-2">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-[var(--nq-muted-foreground)] text-xs" dir="ltr">
          {varName} · {ratio}
        </div>
      </div>
    </div>
  )
}

/* ── fixture card ──────────────────────────────────────────────────────── */

function FixtureCard({ label, profile, lang }: { label: string; profile: Profile; lang: Lang }) {
  const pct = completionPercent(profile)
  const [shown, setShown] = useState(pct)
  const sections = visibleSections(profile, 'A')
  const name = resolveField(profile.fields.fullName, lang)
  const tagline = resolveField(profile.fields.tagline, lang)
  const hasPhone = profile.sections.links.some((l) => l.kind === 'phone')

  // Signature 6 — count-up. Under reduced motion it jumps straight to the value.
  useEffect(() => {
    const tween = countUp(0, pct, setShown)
    return () => {
      tween?.kill()
    }
  }, [pct])

  return (
    <Glass className="p-5" hover>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold">{label}</h3>
        <span
          className="rounded-full px-2.5 py-0.5 text-sm font-semibold"
          style={{ background: 'var(--nq-highlight)', color: 'var(--nq-on-highlight)' }}
        >
          {formatNumber(shown, lang)}%
        </span>
      </div>

      <p className="text-xl font-bold" lang={name?.lang} dir={name?.lang === 'en' ? 'ltr' : 'rtl'}>
        {name?.text}
      </p>
      {tagline ? (
        <p
          className="text-[var(--nq-muted-foreground)] mb-3"
          lang={tagline.lang}
          dir={tagline.lang === 'en' ? 'ltr' : 'rtl'}
        >
          {tagline.text}
          {tagline.isFallback ? (
            <span className="ms-2 text-xs opacity-70">(عربي — ما في ترجمة لهالحقل)</span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-4 space-y-1">
        <Row label="الأقسام اللي بتنعرض">
          <span className="flex flex-wrap justify-end gap-1">
            {sections.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[var(--nq-border)] px-2 py-0.5 text-xs"
              >
                {ui[s as keyof typeof ui] ? t(s as keyof typeof ui, lang) : s}
              </span>
            ))}
          </span>
        </Row>
        <Row label="قسم الخبرة">
          {hasSection(profile, 'experience') ? (
            <span className="inline-flex items-center gap-1">
              <Check size={16} aria-hidden="true" /> بينعرض
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[var(--nq-muted-foreground)]">
              <Minus size={16} aria-hidden="true" /> ما بينعرض إطلاقًا
            </span>
          )}
        </Row>
        <Row label="رقم الهاتف">
          {hasPhone ? (
            'موجود بالـ DOM'
          ) : (
            <span className="text-[var(--nq-muted-foreground)]">مش موجود بالـ DOM</span>
          )}
        </Row>
        {profile.sections.education?.gpa ? (
          <Row label="المعدّل">{formatGpa(profile.sections.education.gpa, lang)}</Row>
        ) : null}
        <Row label="سنة">
          {profile.sections.education?.year
            ? formatNumber(profile.sections.education.year, lang)
            : '—'}
        </Row>
      </div>

      <ul className="mt-4 space-y-1.5">
        {completionAxes(profile).map((a) => (
          <li key={a.key} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full"
              style={{
                background: a.done ? 'var(--nq-accent)' : 'transparent',
                color: a.done ? 'var(--nq-on-accent)' : 'var(--nq-muted-foreground)',
                border: a.done ? 'none' : '1px solid var(--nq-border-strong)',
              }}
            >
              {a.done ? <Check size={13} /> : null}
            </span>
            <span className={a.done ? '' : 'text-[var(--nq-muted-foreground)]'}>{a.labelAr}</span>
          </li>
        ))}
      </ul>
    </Glass>
  )
}

/* ── page ──────────────────────────────────────────────────────────────── */

const MOTION_SIGNATURES = [
  ['١', 'دخول الواجهة', 'الاسم كلمة كلمة + البطاقة بترتفع ١٦px', 'expo.out · ٦٠٠ms', 'شغّالة'],
  ['٢', 'ظهور الأقسام', 'شفافية + ١٢px، بتقرأ كتلاشي مش انزلاق', 'power1.out · ٣٥٠ms', 'شغّالة'],
  ['٣', 'مرور فوق الزجاج', 'ارتفاع ٢px، الحدّ بيفتح، تمويه +٢px', 'CSS · ٢٠٠ms', 'شغّالة'],
  ['٤', 'انتقال الصفحات', 'خروج ٢٠٠ms، دخول ٦٠٠ms باتجاه القراءة', 'expo.inOut', 'المرحلة ٣'],
  ['٥', 'تبديل القالب', 'FLIP على بطاقة الواجهة', 'expo.inOut · ٦٠٠ms', 'المرحلة ٣'],
  ['٦', 'عدّاد الاكتمال', 'عدّ تصاعدي بلا احتفال زائد', 'power2.out · ٦٠٠ms', 'شغّالة'],
] as const

export default function FoundationsPage() {
  const { lang } = useLang()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--nq-border)] bg-[var(--glass-bg-subtle)] backdrop-blur-md">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <Wordmark withLatin />
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container-page py-12 md:py-20">
        {/* Hero */}
        <section className="mb-16 max-w-3xl">
          <p
            data-hero
            className="mb-3 inline-block rounded-full border border-[var(--nq-border)] px-3 py-1 text-sm"
          >
            المرحلة ١ — الأساسات
          </p>
          <h1
            data-hero-headline
            className="mb-4 text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold"
          >
            الأساس جاهز. القوالب جايّة بعدين.
          </h1>
          <p data-hero className="text-[var(--nq-muted-foreground)] max-w-2xl text-lg">
            هاي الصفحة مش صفحة الهبوط. هاي عشان تشوف بعينك إنّ التوكنز والزجاج والخطوط
            والحركة والبيانات التجريبية كلها شغّالة قبل ما نبني القوالب.
          </p>
        </section>

        {/* Colours */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-6">الألوان — مقيسة، مش مفترضة</SectionHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Swatch name="الخلفية" varName="--nq-background" ratio="—" />
            <Swatch name="النص" varName="--nq-foreground" ratio="16.72:1 / 17.25:1" onColor="--nq-background" />
            <Swatch name="نص ثانوي" varName="--nq-muted-foreground" ratio="8.70:1 / 10.64:1" onColor="--nq-background" />
            <Swatch name="اللون الأساسي" varName="--nq-accent" ratio="7.15:1 / 8.15:1" onColor="--nq-on-accent" />
            <Swatch name="اللون الثاني" varName="--nq-accent-2" ratio="5.34:1 / 8.41:1" onColor="--nq-on-accent-2" />
            <Swatch name="تمييز" varName="--nq-highlight" ratio="10.12:1" onColor="--nq-on-highlight" />
          </div>
          <p className="text-[var(--nq-muted-foreground)] mt-4 text-sm">
            كل نسبة فوق مقيسة بـ <code dir="ltr">scripts/contrast.py</code> على الزجاج فوق
            أشدّ كرة لونًا، مش مقدّرة بالنظر.
          </p>
        </Reveal>

        {/* Glass */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-6">الزجاج — ثلاث شدّات</SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {(['subtle', 'default', 'strong'] as const).map((intensity) => (
              <Glass key={intensity} intensity={intensity} hover className="p-5">
                <h3 className="mb-1 text-lg font-bold">
                  {intensity === 'subtle' ? 'خفيف' : intensity === 'strong' ? 'قوي' : 'أساسي'}
                </h3>
                <p className="text-[var(--nq-muted-foreground)] text-sm" dir="ltr">
                  .glass{intensity === 'default' ? '' : `-${intensity}`}
                </p>
                <p className="mt-3 text-sm">
                  نصّ عربي فوق الزجاج لازم يضل مقروء فوق أي كرة لون تحته. مرّر الفأرة
                  عشان تشوف الارتفاع.
                </p>
              </Glass>
            ))}
          </div>
        </Reveal>

        {/* Type */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-6">الخط — عربي أولًا</SectionHeading>
          <Glass className="p-6">
            <p className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold leading-[1.3]">
              نُقوش — موقعك الشخصي
            </p>
            <p className="mt-2 text-2xl font-bold leading-[1.3]">عنوان قسم بحجم متوسط</p>
            <p className="mt-3 max-w-2xl leading-[1.75]">
              نصّ الجسم بارتفاع سطر ١٫٧٥ لأنّ العربية بدها مساحة أكتر من اللاتيني. هاد
              السطر فيه كلمة إنجليزية مثل <span lang="en">TypeScript</span> عشان تتأكّد إنّ
              السطر ما بينكسر وإنّ الخطّين على نفس خطّ الأساس.
            </p>
            <div className="text-[var(--nq-muted-foreground)] mt-4 grid gap-1 text-sm sm:grid-cols-2">
              <span>العناوين: Cairo</span>
              <span>الجسم: IBM Plex Sans Arabic</span>
              <span>الشعار: Amiri</span>
              <span dir="ltr">font-display: swap · arabic + latin subsets</span>
            </div>
          </Glass>
        </Reveal>

        {/* Numerals */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-6">اللغة والأرقام</SectionHeading>
          <Glass className="p-6">
            <p className="mb-4">
              اضغط زر اللغة فوق. بيتغيّر الاتجاه والخط والأرقام والمحتوى — حقل حقل، مش
              الموقع كله دفعة وحدة.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <Row label="اللغة الحالية">{lang === 'ar' ? 'العربية' : 'English'}</Row>
              <Row label="معدّل">{formatGpa(3.4, lang)}</Row>
              <Row label="عدد">{formatNumber(2028, lang, { useGrouping: false })}</Row>
            </div>
          </Glass>
        </Reveal>

        {/* Motion */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-6">الحركة — ست توقيعات</SectionHeading>
          <Glass className="overflow-x-auto p-2">
            <table className="w-full min-w-[36rem] text-start text-sm">
              <thead className="text-[var(--nq-muted-foreground)]">
                <tr>
                  {['#', 'التوقيع', 'الوصف', 'التوقيت', 'الحالة'].map((h) => (
                    <th key={h} className="px-3 py-2 text-start font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOTION_SIGNATURES.map(([n, name, desc, timing, status]) => (
                  <tr key={n} className="border-t border-[var(--nq-border)]">
                    <td className="px-3 py-2">{n}</td>
                    <td className="px-3 py-2 font-medium">{name}</td>
                    <td className="text-[var(--nq-muted-foreground)] px-3 py-2">{desc}</td>
                    <td className="px-3 py-2" dir="ltr">
                      {timing}
                    </td>
                    <td className="px-3 py-2">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Glass>
          <p className="text-[var(--nq-muted-foreground)] mt-4 text-sm">
            شغّل «تقليل الحركة» بإعدادات نظامك وحدّث الصفحة: ما بينبني ولا tween، والصفحة
            بتظهر ساكنة بالكامل. أطفئ الجافاسكربت: كل المحتوى بيضل ظاهر.
          </p>
        </Reveal>

        {/* Fixtures */}
        <Reveal as="section" className="mb-16">
          <SectionHeading className="mb-2">البيانات التجريبية</SectionHeading>
          <p className="text-[var(--nq-muted-foreground)] mb-6 max-w-2xl">
            الحالة الافتراضية هي «بلا خبرة». كل قالب بينحكم عليه فيها أولًا، وبعدين
            بالحالة الكاملة.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <FixtureCard label="بلا خبرة — الحالة الافتراضية" profile={fixtures['no-experience']} lang={lang} />
            <FixtureCard label="كاملة" profile={fixtures.full} lang={lang} />
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-[var(--nq-border)] py-8">
        <div className="container-page text-[var(--nq-muted-foreground)] flex flex-wrap items-center justify-between gap-3 text-sm">
          <Wordmark />
          <span>{t('builtWith', lang)}</span>
        </div>
      </footer>
    </>
  )
}
