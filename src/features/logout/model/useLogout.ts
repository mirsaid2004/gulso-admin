import { useQueryClient } from '@tanstack/react-query'
import { authApi, useSessionStore } from '@/entities/session'

/**
 * Ends the session: revokes the refresh token (best effort), forgets tokens and
 * drops all cached data. The route guard then sends the user to the login page.
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return async () => {
    const { refreshToken, clearSession } = useSessionStore.getState()
    try {
      await authApi.logout(refreshToken)
    } catch {
      /* signing out locally is enough if the server is unreachable */
    }
    clearSession()
    queryClient.clear()
  }
}
