import { HttpResponse } from 'msw'
import type { User } from '@/entities/user'
import { API_PREFIX } from '@/shared/api'
import { db } from '../db'

export const api = (path: string) => `*${API_PREFIX}${path}`

export const ok = <T>(data: T) => HttpResponse.json({ success: true, data })

export const fail = (status: number, code: string, message: string) =>
  HttpResponse.json({ success: false, data: null, error: { code, message } }, { status })

export const notFound = (what: string) => fail(404, 'NOT_FOUND', `${what} not found`)

/** Applies a PATCH body to an entity in place, never touching its id. */
export function applyPatch<T extends { id: number }>(entity: T, patch: Partial<T>): T {
  const { id: _ignored, ...rest } = patch
  return Object.assign(entity, rest)
}

/** The maintainer behind the request's Bearer token, if the token is valid. */
export function currentMaintainer(request: Request): User | undefined {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '')
  const session = token ? db.sessions.find((s) => s.accessToken === token) : undefined
  const user = session && db.users.find((u) => u.id === session.userId)
  return user && user.roles.includes('ADMIN') && !user.blocked ? user : undefined
}
