export type OrderStatus = 'ACCEPTED' | 'PREPARING' | 'IN_DELIVERY' | 'COMPLETED' | 'CANCELLED'

export type DeliveryType = 'DELIVERY' | 'PICKUP'

export interface Order {
  id: number
  userId: number
  shopId: number
  /** Human-readable line items, e.g. "Red Roses Bundle ×2" */
  items: string
  /** UZS */
  total: number
  status: OrderStatus
  deliveryType: DeliveryType
  /** ISO local date-time */
  createdAt: string
}

export type OrderPatch = Partial<Omit<Order, 'id'>>
