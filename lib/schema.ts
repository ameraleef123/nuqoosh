import { z } from 'zod'

/* ═══════════════════════════════════════════════════════════════════════════
   Bilingual per FIELD, never per site.
   A student who translated three fields gets those three in English and the
   rest in Arabic. `ar` is required, `en` is optional — always.
   ═══════════════════════════════════════════════════════════════════════════ */

export const localizedText = z.object({
  ar: z.string(),
  en: z.string().optional(),
})
export type LocalizedText = z.infer<typeof localizedText>

/** Optional bilingual field: absent means the student never filled it. */
export const optionalLocalizedText = localizedText.optional()

export const linkKind = z.enum([
  'email',
  'phone',
  'linkedin',
  'github',
  'behance',
  'x',
  'instagram',
  'website',
  'other',
])
export type LinkKind = z.infer<typeof linkKind>

export const link = z.object({
  id: z.string(),
  kind: linkKind,
  /** Raw value: an address, a handle, or a URL. Never rendered when empty. */
  value: z.string().min(1),
  label: optionalLocalizedText,
})

export const project = z.object({
  id: z.string(),
  title: localizedText,
  description: optionalLocalizedText,
  /** Course work IS the work. Labeled honestly, never hidden. */
  kind: z.enum(['course', 'personal', 'team']).default('course'),
  courseName: optionalLocalizedText,
  tools: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  year: z.number().int().optional(),
})
export type Project = z.infer<typeof project>

/** Presented as leadership / teaching, never as a footnote. */
export const volunteering = z.object({
  id: z.string(),
  role: localizedText,
  organization: localizedText,
  impact: optionalLocalizedText,
  from: z.string().optional(),
  to: z.string().optional(),
})

export const activity = z.object({
  id: z.string(),
  title: localizedText,
  detail: optionalLocalizedText,
})

/** Optional in every sense: the wizard step is skippable and the section is
 *  simply not rendered when this array is empty. */
export const experience = z.object({
  id: z.string(),
  role: localizedText,
  employer: localizedText,
  summary: optionalLocalizedText,
  from: z.string().optional(),
  to: z.string().optional(),
})

export const education = z.object({
  university: localizedText,
  major: localizedText,
  /** Arabic-Indic rendering is a formatting concern, so this stays a number. */
  gpa: z.number().min(0).max(4).optional(),
  gpaScale: z.literal(4).default(4),
  year: z.number().int().min(1).max(7).optional(),
  expectedGraduation: z.number().int().optional(),
})

export const skill = z.object({
  id: z.string(),
  name: localizedText,
  group: z.enum(['technical', 'language', 'soft']).default('technical'),
})

export const profileSchema = z.object({
  /** Arabic handle — the short link the student is proud of. */
  handle: z.string().min(2),
  /** Latin twin: chat apps percent-encode Arabic URLs on copy. Both permanent. */
  latinHandle: z.string().regex(/^[a-z0-9-]{2,40}$/),
  /** SHA-256 of the edit token. The plaintext is shown once and never stored. */
  editTokenHash: z.string().optional(),
  ownerUserId: z.string().optional(),

  templateId: z.string(),
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  plan: z.enum(['free', 'paid']).default('free'),
  accent: z.string().optional(), // paid only

  fields: z.object({
    fullName: localizedText,
    tagline: optionalLocalizedText,
    about: optionalLocalizedText,
    location: optionalLocalizedText,
  }),

  sections: z.object({
    education: education.optional(),
    projects: z.array(project).default([]),
    volunteering: z.array(volunteering).default([]),
    activities: z.array(activity).default([]),
    experience: z.array(experience).default([]),
    skills: z.array(skill).default([]),
    links: z.array(link).default([]),
  }),

  publishedAt: z.string().datetime().optional(),
  hiddenAt: z.string().datetime().optional(),
})

export type Profile = z.infer<typeof profileSchema>

/* ── Section presence ──────────────────────────────────────────────────────
   The single source of truth for "is this section rendered at all".
   An empty section is never rendered: no heading, no gap, no nudge.
   ────────────────────────────────────────────────────────────────────────── */

export type SectionKey =
  | 'education'
  | 'projects'
  | 'volunteering'
  | 'activities'
  | 'experience'
  | 'skills'
  | 'links'

export function hasSection(profile: Profile, key: SectionKey): boolean {
  const s = profile.sections
  switch (key) {
    case 'education':
      return Boolean(s.education?.university.ar || s.education?.major.ar)
    case 'projects':
      return s.projects.length > 0
    case 'volunteering':
      return s.volunteering.length > 0
    case 'activities':
      return s.activities.length > 0
    case 'experience':
      return s.experience.length > 0
    case 'skills':
      return s.skills.length > 0
    case 'links':
      return s.links.length > 0
  }
}

/** Section order variants from design-system/nuqush/templates.md. */
export const SECTION_ORDERS = {
  A: ['projects', 'volunteering', 'activities', 'experience', 'education', 'skills', 'links'],
  B: ['education', 'projects', 'volunteering', 'activities', 'experience', 'skills', 'links'],
  C: ['skills', 'projects', 'volunteering', 'activities', 'experience', 'education', 'links'],
} as const satisfies Record<string, readonly SectionKey[]>

export type SectionOrderVariant = keyof typeof SECTION_ORDERS

/** Returns only the sections that actually have content, in template order. */
export function visibleSections(
  profile: Profile,
  variant: SectionOrderVariant = 'A'
): SectionKey[] {
  return SECTION_ORDERS[variant].filter((key) => hasSection(profile, key))
}

/* ── Completion meter ──────────────────────────────────────────────────────
   Reaches 100% WITHOUT a job. Experience, volunteering and activities are one
   shared axis — any single one of them satisfies it.
   ────────────────────────────────────────────────────────────────────────── */

export type CompletionAxis = {
  key: string
  labelAr: string
  done: boolean
  weight: number
}

export function completionAxes(profile: Profile): CompletionAxis[] {
  const f = profile.fields
  const s = profile.sections
  return [
    { key: 'name', labelAr: 'اسمك', done: Boolean(f.fullName.ar.trim()), weight: 20 },
    { key: 'tagline', labelAr: 'سطر يعرّف فيك', done: Boolean(f.tagline?.ar.trim()), weight: 15 },
    {
      key: 'education',
      labelAr: 'دراستك',
      done: Boolean(s.education?.university.ar.trim() && s.education?.major.ar.trim()),
      weight: 20,
    },
    { key: 'projects', labelAr: 'مشروع واحد على الأقل', done: s.projects.length > 0, weight: 20 },
    {
      // The axis that makes 100% reachable with no job.
      key: 'involvement',
      labelAr: 'تطوّع أو نشاط أو خبرة',
      done: s.volunteering.length > 0 || s.activities.length > 0 || s.experience.length > 0,
      weight: 15,
    },
    { key: 'links', labelAr: 'طريقة تواصل', done: s.links.length > 0, weight: 10 },
  ]
}

export function completionPercent(profile: Profile): number {
  const axes = completionAxes(profile)
  const total = axes.reduce((sum, a) => sum + a.weight, 0)
  const done = axes.reduce((sum, a) => sum + (a.done ? a.weight : 0), 0)
  return Math.round((done / total) * 100)
}
