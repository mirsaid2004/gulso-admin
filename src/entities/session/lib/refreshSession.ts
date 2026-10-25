import { authApi } from '../api/authApi'
import { useSessionStore } from '../model/sessionStore'

let inFlight: Promise<boolean> | null = null

/**
 * Exchanges the refresh token for new tokens. Concurrent 401s share one
 * refresh request instead of racing (refresh tokens are single-use).
 */
export function refreshSession(): Promise<boolean> {
  inFlight ??= (async () => {
    const { refreshToken, setTokens } = useSessionStore.getState()
    if (!refreshToken) return false
    try {
      setTokens(await authApi.refresh(refreshToken))
      return true
    } catch {
      return false
    } finally {
      inFlight = null
    }
  })()
  return inFlight
}
