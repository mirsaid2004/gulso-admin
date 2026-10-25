import type { PillTone } from '@/shared/ui'
import type { Role } from './types'

export const ROLE_META: Record<Role, { label: string; title: string; tone: PillTone }> = {
  USER: { label: 'USER', title: 'Buyer', tone: 'slate' },
  SELLER: { label: 'SELLER', title: 'Seller', tone: 'primarySoft' },
  ADMIN: { label: 'ADMIN', title: 'Maintainer', tone: 'primary' },
}

export const ROLES: Role[] = ['USER', 'SELLER', 'ADMIN']
