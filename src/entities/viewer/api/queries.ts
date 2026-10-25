import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Viewer } from '../model/types'

export const viewerKeys = {
  me: ['viewer'] as const,
}

export function useViewerQuery() {
  return useQuery({
    queryKey: viewerKeys.me,
    queryFn: () => apiClient.get<Viewer>('/admin/me'),
    staleTime: Infinity,
  })
}
