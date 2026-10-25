import type { Role } from '@/entities/user'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Response of POST /auth/otp/login */
export interface AuthResponse extends AuthTokens {
  tokenType: 'Bearer'
  expiresIn: number
  userId: number
  name: string
  roles: Role[]
}

export interface SessionUser {
  id: number
  name: string
  roles: Role[]
}

/** GET /admin/me — the signed-in maintainer */
export interface Profile extends SessionUser {
  avatarUrl: string | null
}
