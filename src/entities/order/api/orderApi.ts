import { apiClient } from '@/shared/api'
import type { Order, OrderPatch } from '../model/types'

export const orderApi = {
  list: () => apiClient.get<Order[]>('/admin/orders'),
  update: (id: number, patch: OrderPatch) => apiClient.patch<Order>(`/admin/orders/${id}`, patch),
}
