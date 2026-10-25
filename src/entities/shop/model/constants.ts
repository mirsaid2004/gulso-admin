import type { PillTone } from '@/shared/ui'
import type { ShopStatus } from './types'

export const SHOP_STATUS_TONE: Record<ShopStatus, PillTone> = {
  ACTIVE: 'emerald',
  NEW: 'blue',
  SUSPENDED: 'slate',
}

export const DEFAULT_COMMISSION = 10
