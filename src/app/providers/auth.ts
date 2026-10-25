import type { QueryClient } from '@tanstack/react-query'
import { refreshSession, useSessionStore } from '@/entities/session'
import { configureApiAuth } from '@/shared/api'

/**
 * Connects the API client to the session: sends the access token, refreshes it
 * on 401, and signs out when that fails (the route guard then shows the login page).
 */
export function setupApiAuth(queryClient?: QueryClient) {
  configureApiAuth({
    getAccessToken: () => useSessionStore.getState().accessToken,
    refresh: refreshSession,
    onUnauthorized: () => {
      if (!useSessionStore.getState().isAuthenticated) return
      useSessionStore.getState().clearSession()
      queryClient?.clear()
    },
  })
}
