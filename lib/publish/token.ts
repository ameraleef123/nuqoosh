import 'server-only'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * The edit token: a one-time secret shown at publish and never stored. The
 * database keeps its SHA-256 only, so a leaked table cannot edit anyone's page.
 */

export function newEditToken(): string {
  return randomBytes(24).toString('base64url')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function tokenMatches(token: string | null | undefined, hash: string): boolean {
  if (!token) return false
  const a = Buffer.from(hashToken(token), 'hex')
  const b = Buffer.from(hash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}
