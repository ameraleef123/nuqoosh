import noExperienceRaw from '@/fixtures/no-experience.json'
import fullRaw from '@/fixtures/full.json'
import { profileSchema, type Profile } from './schema'

/**
 * Parsed at import time, so a fixture that drifts from the schema fails the
 * build instead of failing silently in a template.
 *
 * `no-experience` is the DEFAULT case: every template is judged against it
 * first. A design that only looks good with `full` is a failed design.
 */
export const noExperienceProfile: Profile = profileSchema.parse(noExperienceRaw)
export const fullProfile: Profile = profileSchema.parse(fullRaw)

export const fixtures = {
  'no-experience': noExperienceProfile,
  full: fullProfile,
} as const

export type FixtureKey = keyof typeof fixtures
