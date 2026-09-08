import type { Profile, SectionKey } from './schema'

/**
 * Runtime profile logic with NO Zod import.
 *
 * `lib/schema.ts` pulls in Zod, which is correct for validating fixtures and
 * API payloads on the server — but the public page renders on the client, and
 * importing a helper from that module dragged Zod into the browser bundle
 * (measured: 131 KB First Load JS, 11 KB over the public-page budget).
 * `import type` is erased at compile time, so the types still come from the
 * schema and stay in sync while nothing ships.
 */

export type { SectionKey }

/* ── Section presence ──────────────────────────────────────────────────────
   The single source of truth for "is this section rendered at all".
   An empty section is never rendered: no heading, no gap, no nudge.
   ────────────────────────────────────────────────────────────────────────── */

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
