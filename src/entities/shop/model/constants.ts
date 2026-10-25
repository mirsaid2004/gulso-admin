import type { PillTone } from '@/shared/ui'
import type { ShopStatus } from './types'

export const SHOP_STATUS_META: Record<ShopStatus, { label: string; tone: PillTone }> = {
  ACTIVE: { label: 'ACTIVE', tone: 'emerald' },
  NEW: { label: 'NEW', tone: 'blue' },
  SUSPENDED: { label: 'SUSPENDED', tone: 'slate' },
}

export const DEFAULT_COMMISSION = 10
