import { apiClient } from '@/shared/api'
import type { ApproveRequestResult, ShopRequest } from '../model/types'

export const shopRequestApi = {
  list: () => apiClient.get<ShopRequest[]>('/admin/shop-requests'),
  approve: (id: number) => apiClient.post<ApproveRequestResult>(`/admin/shop-requests/${id}/approve`),
  requestChanges: (id: number, note: string) =>
    apiClient.post<ShopRequest>(`/admin/shop-requests/${id}/request-changes`, { note }),
  reject: (id: number, note: string) => apiClient.post<ShopRequest>(`/admin/shop-requests/${id}/reject`, { note }),
}
