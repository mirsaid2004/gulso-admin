import type { PillTone } from '@/shared/ui'
import type { DeliveryType, OrderStatus } from './types'

export const ORDER_STATUSES: OrderStatus[] = ['ACCEPTED', 'PREPARING', 'IN_DELIVERY', 'COMPLETED', 'CANCELLED']

export const ORDER_STATUS_TONE: Record<OrderStatus, PillTone> = {
  ACCEPTED: 'amber',
  PREPARING: 'blue',
  IN_DELIVERY: 'purple',
  COMPLETED: 'emerald',
  CANCELLED: 'slate',
}

export const DELIVERY_TYPES: DeliveryType[] = ['DELIVERY', 'PICKUP']

export const DELIVERY_TONE: Record<DeliveryType, PillTone> = {
  DELIVERY: 'indigo',
  PICKUP: 'teal',
}
