import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api'
import { loginErrorKey } from './errors'

describe('loginErrorKey', () => {
  it.each(['NOT_MAINTAINER', 'USER_BLOCKED', 'INVALID_OTP'])('maps %s to its own message', (code) => {
    expect(loginErrorKey(new ApiError(403, code, 'server text'))).toBe(code)
  })

  it('falls back to a generic message', () => {
    expect(loginErrorKey(new ApiError(500, 'BOOM', 'x'))).toBe('generic')
    expect(loginErrorKey(new TypeError('Failed to fetch'))).toBe('generic')
  })
})
