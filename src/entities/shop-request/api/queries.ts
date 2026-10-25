import { useQuery } from '@tanstack/react-query'
import { shopRequestApi } from './shopRequestApi'

export const shopRequestKeys = {
  all: ['shop-requests'] as const,
}

export function useShopRequestsQuery() {
  return useQuery({ queryKey: shopRequestKeys.all, queryFn: shopRequestApi.list })
}

/** Number of requests waiting for review; drives the sidebar and bell badges. */
export function usePendingRequestCount(): number {
  const { data } = useQuery({
    queryKey: shopRequestKeys.all,
    queryFn: shopRequestApi.list,
    select: (requests) => requests.filter((r) => r.status === 'PENDING').length,
  })
  return data ?? 0
}
