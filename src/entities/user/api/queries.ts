import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserPatch } from '../model/types'
import { userApi } from './userApi'

export const userKeys = {
  all: ['users'] as const,
}

export function useUsersQuery() {
  return useQuery({ queryKey: userKeys.all, queryFn: userApi.list })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: UserPatch }) => userApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
