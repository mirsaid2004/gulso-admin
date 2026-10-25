import type { User } from '../model/types'

export const UNKNOWN_USER: User = { id: 0, name: '—', phone: '', roles: [], joinedAt: '', blocked: false }

export function findUser(users: User[], id: number): User {
  return users.find((u) => u.id === id) ?? UNKNOWN_USER
}

export const isMaintainer = (user: User) => user.roles.includes('ADMIN')
