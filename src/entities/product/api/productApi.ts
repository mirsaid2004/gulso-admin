import { apiClient } from '@/shared/api'
import type { Product, ProductPatch } from '../model/types'

export const productApi = {
  list: () => apiClient.get<Product[]>('/admin/products'),
  update: (id: number, patch: ProductPatch) => apiClient.patch<Product>(`/admin/products/${id}`, patch),
}
