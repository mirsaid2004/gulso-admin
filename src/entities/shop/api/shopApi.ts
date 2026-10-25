import { apiClient } from '@/shared/api'
import type { Shop, ShopPatch } from '../model/types'

export const shopApi = {
  list: () => apiClient.get<Shop[]>('/admin/shops'),
  update: (id: number, patch: ShopPatch) => apiClient.patch<Shop>(`/admin/shops/${id}`, patch),
}
