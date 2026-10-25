import { apiClient } from '@/shared/api'
import type { User, UserPatch } from '../model/types'

export const userApi = {
  list: () => apiClient.get<User[]>('/admin/users'),
  update: (id: number, patch: UserPatch) => apiClient.patch<User>(`/admin/users/${id}`, patch),
}
