'use client'

import type { Profile } from '@/lib/schema'
import type { Template } from '@/lib/templates'
import { resolveField, t, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/cn'

/**
 * Gallery thumbnail.
 *
 * Not a scaled-down copy of the full page. Scaling a real render with `zoom` or
 * `transform` put the content off-frame at every card width and cost four full
 * page renders on one screen; this composes the same tokens, background, fonts
 * and glass at natural size instead.
 *
 * It is still a live preview of the student's own data — name, tagline, and a
 * real project with its honest «مشروع مساق» badge — so what the card promises
 * is what the page delivers.
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
}: {
  template: Template
  profile: Profile
  lang: Lang
}) {
  const name = resolveField(profile.fields.fullName, lang)
  const tagline = resolveField(profile.fields.tagline, lang)
  const project = profile.sections.projects[0]
  const volunteering = profile.sections.volunteering[0]
  const skills = profile.sections.skills.slice(0, 4)
  const edu = profile.sections.education
  const glass = GLASS[template.glass]
  const editorial = template.hero === 'editorial'

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
        {/* Hero slice — the editorial template has no panel, which is its identity. */}
        <div className={cn(editorial ? 'border-b border-[var(--nq-border)] pb-3' : cn(glass, 'p-3'))}>
          <p
            className={cn(
              'text-[1.0625rem] leading-tight font-extrabold',
              template.hero === 'centered' && 'text-center'
            )}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name?.text}
          </p>
          {tagline ? (
            <p
              className={cn(
                'text-[var(--nq-muted-foreground)] mt-1 line-clamp-2 text-[0.6875rem] leading-snug',
                template.hero === 'centered' && 'text-center',
                editorial && 'border-s-2 border-[var(--nq-accent)] ps-2'
              )}
            >
              {tagline.text}
            </p>
          ) : null}
        </div>

        {/* Education pills — present on every real page, and they read instantly. */}
        {edu ? (
          <div
            className={cn(
              'flex flex-wrap gap-1',
              template.hero === 'centered' && 'justify-center'
            )}
          >
            {[resolveField(edu.university, lang)?.text, resolveField(edu.major, lang)?.text]
              .filter(Boolean)
              .map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[var(--nq-border)] px-1.5 py-px text-[0.5625rem]"
                >
                  {label}
                </span>
              ))}
          </div>
        ) : null}

        {/* One real project, badged honestly. */}
        {project ? (
          <div className={cn(glass, 'p-3')}>
            <p
              className="mb-1.5 text-[0.8125rem] font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('projects', lang)}
            </p>
            <div
              className={cn(
                template.card === 'tile' && 'glass-subtle rounded-[var(--nq-radius-sm)] p-2',
                template.card === 'panel' &&
                  'rounded-[var(--nq-radius-sm)] border border-[var(--nq-border)] p-2',
                template.card === 'list' && 'border-t border-[var(--nq-border)] pt-2'
              )}
            >
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[0.6875rem] font-bold">
                  {resolveField(project.title, lang)?.text}
                </span>
                <span
                  className="rounded-full px-1.5 py-px text-[0.5rem] font-semibold"
                  style={{
                    background: 'var(--nq-highlight)',
                    color: 'var(--nq-on-highlight)',
                  }}
                >
                  {t('courseProject', lang)}
                </span>
              </div>
              <p className="text-[var(--nq-muted-foreground)] mt-1 line-clamp-2 text-[0.5625rem] leading-snug">
                {resolveField(project.description, lang)?.text}
              </p>
            </div>
          </div>
        ) : null}

        {/* Volunteering reads as leadership here too, not as a footnote. */}
        {volunteering ? (
          <div className={cn(glass, 'p-3')}>
            <p
              className="mb-1 text-[0.8125rem] font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('volunteering', lang)}
            </p>
            <p className="text-[0.6875rem] font-bold">
              {resolveField(volunteering.role, lang)?.text}
              <span className="text-[var(--nq-muted-foreground)] font-normal">
                {' — '}
                {resolveField(volunteering.organization, lang)?.text}
              </span>
            </p>
            <p className="text-[var(--nq-muted-foreground)] mt-0.5 line-clamp-2 text-[0.5625rem] leading-snug">
              {resolveField(volunteering.impact, lang)?.text}
            </p>
          </div>
        ) : null}

        {skills.length ? (
          <div className="mt-auto flex flex-wrap gap-1">
            {skills.map((sk) => (
              <span
                key={sk.id}
                className="rounded-full border border-[var(--nq-border)] px-1.5 py-px text-[0.5625rem]"
              >
                {resolveField(sk.name, lang)?.text}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
