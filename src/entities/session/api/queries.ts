import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Profile } from '../model/types'

export const sessionKeys = {
  profile: ['session', 'profile'] as const,
}

export function useProfileQuery() {
  return useQuery({
    queryKey: sessionKeys.profile,
    queryFn: () => apiClient.get<Profile>('/admin/me'),
    staleTime: Infinity,
  })
}
