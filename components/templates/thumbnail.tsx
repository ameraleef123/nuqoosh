'use client'

import type { Profile } from '@/lib/schema'
import type { Template } from '@/lib/templates'
import { formatGpa, formatNumber, resolveField, t, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/cn'

/**
 * Gallery preview.
 *
 * Not a scaled-down copy of the full page. Scaling a real render with `zoom` or
 * `transform` put the content off-frame at every card width and cost four full
 * page renders on one screen; this composes the same tokens, background, fonts
 * and glass at natural size instead.
 *
 * It is still a live preview of the student's own data — their name, tagline,
 * a real project with its honest «مشروع مساق» badge, and their volunteering as
 * leadership — so what the preview promises is what the page delivers.
 *
 * `variant` is the only difference between the two placements:
 *   card — fills a portrait aspect box, paints its own background
 *   wide — sits inside a full-bleed band that already paints the background,
 *          and lays its blocks out in two columns
 */

const GLASS: Record<Template['glass'], string> = {
  subtle: 'glass-subtle',
  default: 'glass',
  strong: 'glass-strong',
}

export function TemplateThumb({
  template,
  profile,
  lang,
  variant = 'card',
}: {
  template: Template
  profile: Profile
  lang: Lang
  variant?: 'card' | 'wide'
}) {
  const wide = variant === 'wide'
  const name = resolveField(profile.fields.fullName, lang)
  const tagline = resolveField(profile.fields.tagline, lang)
  const project = profile.sections.projects[0]
  const volunteering = profile.sections.volunteering[0]
  const skills = profile.sections.skills.slice(0, wide ? 6 : 4)
  const edu = profile.sections.education
  const glass = GLASS[template.glass]
  const editorial = template.hero === 'editorial'

  const heroBlock = (
    <div className={cn(editorial ? 'border-b border-[var(--nq-border)] pb-3' : cn(glass, 'p-3'))}>
      <p
        className={cn(
          'leading-tight font-extrabold',
          wide ? 'text-[1.75rem]' : 'text-[1.0625rem]',
          template.hero === 'centered' && 'text-center'
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {name?.text}
      </p>
      {tagline ? (
        <p
          className={cn(
            'text-[var(--nq-muted-foreground)] mt-1 leading-snug',
            wide ? 'text-[0.9375rem]' : 'line-clamp-2 text-[0.6875rem]',
            template.hero === 'centered' && 'text-center',
            editorial && 'border-s-2 border-[var(--nq-accent)] ps-2'
          )}
        >
          {tagline.text}
        </p>
      ) : null}
    </div>
  )

  const pills = edu ? (
    <div
      className={cn(
        'flex flex-wrap gap-1',
        template.hero === 'centered' && !wide && 'justify-center'
      )}
    >
      {[
        resolveField(edu.university, lang)?.text,
        resolveField(edu.major, lang)?.text,
        edu.year ? `${lang === 'ar' ? 'سنة ' : 'Year '}${formatNumber(edu.year, lang)}` : null,
        typeof edu.gpa === 'number'
          ? `${lang === 'ar' ? 'معدّل ' : 'GPA '}${formatGpa(edu.gpa, lang)}`
          : null,
      ]
        .filter(Boolean)
        .slice(0, wide ? 4 : 2)
        .map((label) => (
          <span
            key={label}
            className={cn(
              'rounded-full border border-[var(--nq-border)]',
              wide ? 'px-2 py-0.5 text-[0.75rem]' : 'px-1.5 py-px text-[0.5625rem]'
            )}
          >
            {label}
          </span>
        ))}
    </div>
  ) : null

  const projectBlock = project ? (
    <div className={cn(glass, wide ? 'p-4' : 'p-3')}>
      <p
        className={cn('font-bold', wide ? 'mb-2 text-[1rem]' : 'mb-1.5 text-[0.8125rem]')}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('projects', lang)}
      </p>
      <div
        className={cn(
          template.card === 'tile' &&
            cn('glass-subtle rounded-[var(--nq-radius-sm)]', wide ? 'p-3' : 'p-2'),
          template.card === 'panel' &&
            cn(
              'rounded-[var(--nq-radius-sm)] border border-[var(--nq-border)]',
              wide ? 'p-3' : 'p-2'
            ),
          template.card === 'list' && cn('border-t border-[var(--nq-border)]', wide ? 'pt-3' : 'pt-2')
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('font-bold', wide ? 'text-[0.9375rem]' : 'text-[0.6875rem]')}>
            {resolveField(project.title, lang)?.text}
          </span>
          <span
            className={cn(
              'rounded-full font-semibold',
              wide ? 'px-2 py-0.5 text-[0.6875rem]' : 'px-1.5 py-px text-[0.5rem]'
            )}
            style={{ background: 'var(--nq-highlight)', color: 'var(--nq-on-highlight)' }}
          >
            {t('courseProject', lang)}
          </span>
        </div>
        <p
          className={cn(
            'text-[var(--nq-muted-foreground)] mt-1 leading-snug',
            wide ? 'text-[0.8125rem]' : 'line-clamp-2 text-[0.5625rem]'
          )}
        >
          {resolveField(project.description, lang)?.text}
        </p>
      </div>
    </div>
  ) : null

  const volunteeringBlock = volunteering ? (
    <div className={cn(glass, wide ? 'p-4' : 'p-3')}>
      <p
        className={cn('font-bold', wide ? 'mb-2 text-[1rem]' : 'mb-1 text-[0.8125rem]')}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('volunteering', lang)}
      </p>
      <p className={cn('font-bold', wide ? 'text-[0.9375rem]' : 'text-[0.6875rem]')}>
        {resolveField(volunteering.role, lang)?.text}
        <span className="text-[var(--nq-muted-foreground)] font-normal">
          {' — '}
          {resolveField(volunteering.organization, lang)?.text}
        </span>
      </p>
      <p
        className={cn(
          'text-[var(--nq-muted-foreground)] mt-0.5 leading-snug',
          wide ? 'text-[0.8125rem]' : 'line-clamp-2 text-[0.5625rem]'
        )}
      >
        {resolveField(volunteering.impact, lang)?.text}
      </p>
    </div>
  ) : null

  const skillsBlock = skills.length ? (
    <div className={cn('flex flex-wrap gap-1', !wide && 'mt-auto')}>
      {skills.map((sk) => (
        <span
          key={sk.id}
          className={cn(
            'rounded-full border border-[var(--nq-border)]',
            wide ? 'px-2 py-0.5 text-[0.75rem]' : 'px-1.5 py-px text-[0.5625rem]'
          )}
        >
          {resolveField(sk.name, lang)?.text}
        </span>
      ))}
    </div>
  ) : null

  /* ── wide: the band already paints the background ─────────────────────── */
  if (wide) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          {heroBlock}
          {pills}
          {skillsBlock}
        </div>
        <div className="flex flex-col gap-4">
          {projectBlock}
          {volunteeringBlock}
        </div>
      </div>
    )
  }

  /* ── card: paints its own background inside a portrait aspect box ─────── */
  return (
    <div
      className="tpl absolute inset-0 overflow-hidden"
      data-template={template.id}
      data-preview="true"
      aria-hidden="true"
    >
      <div className="tpl-bg" data-bg={template.background}>
        {template.background === 'dawn' ? <span className="tpl-sky" /> : null}
        <span
          className="orb"
          data-orb="1"
          style={{
            inlineSize: '80%',
            blockSize: '55%',
            insetInlineStart: '-15%',
            insetBlockStart: '-15%',
          }}
        />
        <span
          className="orb"
          data-orb="2"
          style={{
            inlineSize: '65%',
            blockSize: '45%',
            insetInlineEnd: '-12%',
            insetBlockStart: '25%',
          }}
        />
        <span
          className="orb"
          data-orb="3"
          style={{
            inlineSize: '70%',
            blockSize: '45%',
            insetInlineStart: '10%',
            insetBlockEnd: '-15%',
          }}
        />
      </div>

      <div className="tpl-content flex h-full flex-col gap-2.5 p-4">
        {heroBlock}
        {pills}
        {projectBlock}
        {volunteeringBlock}
        {skillsBlock}
      </div>
    </div>
  )
}
