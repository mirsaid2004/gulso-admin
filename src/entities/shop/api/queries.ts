import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ShopPatch } from '../model/types'
import { shopApi } from './shopApi'

export const shopKeys = {
  all: ['shops'] as const,
}

export function useShopsQuery() {
  return useQuery({ queryKey: shopKeys.all, queryFn: shopApi.list })
}

export function useUpdateShopMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: ShopPatch }) => shopApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shopKeys.all }),
  })
}
