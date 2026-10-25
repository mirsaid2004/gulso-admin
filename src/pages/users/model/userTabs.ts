import type { Role, User } from '@/entities/user'

export type UserTab = 'ALL' | Role | 'BLOCKED'

export const USER_TABS: UserTab[] = ['ALL', 'USER', 'SELLER', 'ADMIN', 'BLOCKED']

export function matchesUserTab(user: Pick<User, 'roles' | 'blocked'>, tab: UserTab): boolean {
  if (tab === 'ALL') return true
  if (tab === 'BLOCKED') return user.blocked
  return user.roles.includes(tab)
}
