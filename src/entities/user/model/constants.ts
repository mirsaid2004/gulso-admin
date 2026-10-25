import type { PillTone } from '@/shared/ui'
import type { Role } from './types'

export const ROLES: Role[] = ['USER', 'SELLER', 'ADMIN']

export const ROLE_TONE: Record<Role, PillTone> = {
  USER: 'slate',
  SELLER: 'primarySoft',
  ADMIN: 'primary',
}
