'use client'

import type { Profile } from '@/lib/schema'

/**
 * The anonymous draft, before there is a database.
 *
 * Lives in localStorage on the student's own device. Nothing is sent anywhere
 * until they press publish (Phase 4). When the database arrives, this becomes
 * the offline mirror behind the autosave, keyed by the server's draft id.
 */

const KEY = 'nuqush-draft'

export type Published = {
  id: string
  handle: string
  latinHandle: string
  /** Kept on this device only, so «حدّث» works without pasting the link back. */
  editToken: string
  publishedAt: string
}

export type Draft = {
  profile: Profile
  found: string[]
  unrecognised: string[]
  importedAt: string
  /** Set once the page is live; the review's button becomes «حدّث». */
  published?: Published
}

export function saveDraft(d: Draft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d))
  } catch {
    /* private mode: the review still works for this session via state */
  }
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

/** What a profile already holds, in the review's "قرينا" vocabulary. */
export function foundFromProfile(p: Profile): string[] {
  const s = p.sections
  const has = (v?: { ar?: string; en?: string }) => Boolean(v?.ar?.trim() || v?.en?.trim())
  const out: string[] = []
  if (has(p.fields.about)) out.push('about')
  if (s.education && (has(s.education.university) || has(s.education.major))) out.push('education')
  if (s.projects.length) out.push('projects')
  if (s.volunteering.length) out.push('volunteering')
  if (s.activities.length) out.push('activities')
  if (s.experience.length) out.push('experience')
  if (s.skills.length) out.push('skills')
  if (s.links.length) out.push('links')
  return out
}
