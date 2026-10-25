import { HttpResponse } from 'msw'
import { API_PREFIX } from '@/shared/api'

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
