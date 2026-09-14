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

export type Draft = {
  profile: Profile
  found: string[]
  unrecognised: string[]
  importedAt: string
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
