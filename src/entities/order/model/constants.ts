import type { PillTone } from '@/shared/ui'
import type { DeliveryType, OrderStatus } from './types'

export const ORDER_STATUSES: OrderStatus[] = ['ACCEPTED', 'PREPARING', 'IN_DELIVERY', 'COMPLETED', 'CANCELLED']

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tab: string; tone: PillTone }> = {
  ACCEPTED: { label: 'ACCEPTED', tab: 'New', tone: 'amber' },
  PREPARING: { label: 'PREPARING', tab: 'Preparing', tone: 'blue' },
  IN_DELIVERY: { label: 'IN DELIVERY', tab: 'In delivery', tone: 'purple' },
  COMPLETED: { label: 'COMPLETED', tab: 'Completed', tone: 'emerald' },
  CANCELLED: { label: 'CANCELLED', tab: 'Cancelled', tone: 'slate' },
}

export const DELIVERY_META: Record<DeliveryType, { label: string; title: string; tone: PillTone }> = {
  DELIVERY: { label: 'DELIVERY', title: 'Delivery', tone: 'indigo' },
  PICKUP: { label: 'PICKUP', title: 'Pickup', tone: 'teal' },
}
