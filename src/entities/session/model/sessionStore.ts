import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, AuthTokens, SessionUser } from './types'

interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  user: SessionUser | null
  isAuthenticated: boolean
  setSession: (auth: AuthResponse) => void
  setTokens: (tokens: AuthTokens) => void
  clearSession: () => void
}

export const SESSION_STORAGE_KEY = 'admin-auth'

const signedOut = { accessToken: null, refreshToken: null, user: null, isAuthenticated: false }

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...signedOut,
      setSession: ({ accessToken, refreshToken, userId, name, roles }) =>
        set({ accessToken, refreshToken, user: { id: userId, name, roles }, isAuthenticated: true }),
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      clearSession: () => set(signedOut),
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: ({ accessToken, refreshToken, user, isAuthenticated }) => ({
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
      }),
    },
  ),
)

export const useIsAuthenticated = () => useSessionStore((s) => s.isAuthenticated)
