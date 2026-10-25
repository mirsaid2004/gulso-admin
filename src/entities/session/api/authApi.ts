import { apiClient } from '@/shared/api'
import type { AuthResponse, AuthTokens } from '../model/types'

export const authApi = {
  sendOtp: (phone: string) => apiClient.post<string>('/auth/otp/send', { phone }),
  verifyOtp: (phone: string, otpCode: string) => apiClient.post<AuthResponse>('/auth/otp/login', { phone, otpCode }),
  refresh: (refreshToken: string) => apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string | null) => apiClient.post<null>('/auth/logout', { refreshToken }),
}
