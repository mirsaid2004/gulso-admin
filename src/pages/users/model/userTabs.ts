import type { Role, User } from '@/entities/user'

export type UserTab = 'ALL' | Role | 'BLOCKED'

export const USER_TABS: Array<{ key: UserTab; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'USER', label: 'Buyers' },
  { key: 'SELLER', label: 'Sellers' },
  { key: 'ADMIN', label: 'Maintainers' },
  { key: 'BLOCKED', label: 'Blocked' },
]

export function matchesUserTab(user: Pick<User, 'roles' | 'blocked'>, tab: UserTab): boolean {
  if (tab === 'ALL') return true
  if (tab === 'BLOCKED') return user.blocked
  return user.roles.includes(tab)
}
