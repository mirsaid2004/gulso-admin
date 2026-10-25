import { useSessionStore } from '@/entities/session'
import { db, issueSession } from '@/mocks/db'

/** Signs the store in with a token the mock API accepts (default: the seeded maintainer, id 1). */
export function signIn(userId = 1) {
  const user = db.users.find((u) => u.id === userId)!
  const { accessToken, refreshToken } = issueSession(userId)
  useSessionStore.getState().setSession({
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    userId,
    name: user.name,
    roles: user.roles,
  })
}

export function signOut() {
  useSessionStore.getState().clearSession()
}
