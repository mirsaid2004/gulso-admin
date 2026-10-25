import * as seed from './data/seed'

export interface DbSession {
  userId: number
  accessToken: string
  refreshToken: string
}

function fresh() {
  return {
    users: structuredClone(seed.users),
    shops: structuredClone(seed.shops),
    products: structuredClone(seed.products),
    orders: structuredClone(seed.orders),
    shopRequests: structuredClone(seed.shopRequests),
    sessions: [] as DbSession[],
  }
}

/** In-memory database. Mutations live until the page reloads (or `resetDb()` in tests). */
export const db = fresh()

export function resetDb() {
  Object.assign(db, fresh())
}

export function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
}

// The rest of the db resets on reload, but losing sessions would sign the user out on
// every refresh, so the browser worker keeps them in localStorage (tests don't).
const SESSIONS_KEY = 'msw-sessions'
let persistSessions = false

export function enableSessionPersistence() {
  persistSessions = true
  try {
    db.sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? '[]') as DbSession[]
  } catch {
    db.sessions = []
  }
}

function setSessions(sessions: DbSession[]) {
  db.sessions = sessions
  if (persistSessions) localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

/** Issues a new token pair for a user and stores it as an active session. */
export function issueSession(userId: number): DbSession {
  const session = {
    userId,
    accessToken: `access-${crypto.randomUUID()}`,
    refreshToken: `refresh-${crypto.randomUUID()}`,
  }
  setSessions([...db.sessions, session])
  return session
}

/** Rotates a refresh token: the old session is replaced by a new one. */
export function rotateSession(refreshToken: string | undefined): DbSession | undefined {
  const old = db.sessions.find((s) => s.refreshToken === refreshToken)
  if (!old) return undefined
  revokeSession(refreshToken)
  return issueSession(old.userId)
}

export function revokeSession(refreshToken: string | undefined) {
  setSessions(db.sessions.filter((s) => s.refreshToken !== refreshToken))
}

const digits = (phone: string) => phone.replace(/\D/g, '')

export const findUserByPhone = (phone: string) => db.users.find((u) => digits(u.phone) === digits(phone))
