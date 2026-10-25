import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProductPatch } from '../model/types'
import { productApi } from './productApi'

export const productKeys = {
  all: ['products'] as const,
}

export function useProductsQuery() {
  return useQuery({ queryKey: productKeys.all, queryFn: productApi.list })
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: ProductPatch }) => productApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}
