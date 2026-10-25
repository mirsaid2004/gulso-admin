import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { OrderPatch } from '../model/types'
import { orderApi } from './orderApi'

export const orderKeys = {
  all: ['orders'] as const,
}

export function useOrdersQuery() {
  return useQuery({ queryKey: orderKeys.all, queryFn: orderApi.list })
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: OrderPatch }) => orderApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  })
}
