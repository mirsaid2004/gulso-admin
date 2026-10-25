import { ApiError } from '@/shared/api'

const KNOWN = ['NOT_MAINTAINER', 'USER_BLOCKED', 'INVALID_OTP'] as const

export type LoginErrorKey = (typeof KNOWN)[number] | 'generic'

/** Maps an API failure to a `login.errors.*` translation key. */
export function loginErrorKey(error: unknown): LoginErrorKey {
  if (error instanceof ApiError && (KNOWN as readonly string[]).includes(error.code)) {
    return error.code as LoginErrorKey
  }
  return 'generic'
}
