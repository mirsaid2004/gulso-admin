import { http } from 'msw'
import { DEMO_OTP } from '../data/seed'
import { findUserByPhone, issueSession, revokeSession, rotateSession } from '../db'
import { api, fail, ok } from './utils'

/** Only active maintainers may sign in to this panel. */
function maintainerByPhone(phone: string | undefined) {
  const user = phone ? findUserByPhone(phone) : undefined
  if (!user || !user.roles.includes('ADMIN')) {
    return fail(403, 'NOT_MAINTAINER', 'This number has no access to the maintainer panel')
  }
  if (user.blocked) return fail(403, 'USER_BLOCKED', 'This account is blocked')
  return user
}

export const authHandlers = [
  http.post(api('/auth/otp/send'), async ({ request }) => {
    const { phone } = (await request.json()) as { phone?: string }
    if (!phone) return fail(400, 'VALIDATION_ERROR', 'Phone is required')
    const user = maintainerByPhone(phone)
    if (user instanceof Response) return user
    return ok('OTP sent successfully')
  }),

  http.post(api('/auth/otp/login'), async ({ request }) => {
    const { phone, otpCode } = (await request.json()) as { phone?: string; otpCode?: string }
    const user = maintainerByPhone(phone)
    if (user instanceof Response) return user
    if (otpCode !== DEMO_OTP) return fail(401, 'INVALID_OTP', 'Invalid OTP code')
    const session = issueSession(user.id)
    return ok({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      userId: user.id,
      name: user.name,
      roles: user.roles,
    })
  }),

  // Refresh tokens are single-use: the old session is replaced by a new one.
  http.post(api('/auth/refresh'), async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken?: string }
    const session = rotateSession(refreshToken)
    if (!session) return fail(401, 'INVALID_REFRESH_TOKEN', 'Session expired')
    return ok({ accessToken: session.accessToken, refreshToken: session.refreshToken })
  }),

  http.post(api('/auth/logout'), async ({ request }) => {
    const { refreshToken } = (await request.json().catch(() => ({}))) as { refreshToken?: string }
    revokeSession(refreshToken)
    return ok(null)
  }),
]
