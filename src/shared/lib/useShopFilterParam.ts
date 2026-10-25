import { useSearchParams } from 'react-router-dom'
import { SHOP_FILTER_PARAM } from '@/shared/config'

/** Reads/writes the `?shop=<id>` filter used by the Products and Orders pages. */
export function useShopFilterParam() {
  const [params, setParams] = useSearchParams()
  const raw = params.get(SHOP_FILTER_PARAM)
  const shopId = raw && !Number.isNaN(Number(raw)) ? Number(raw) : null

  const setShopId = (id: number | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id == null) next.delete(SHOP_FILTER_PARAM)
        else next.set(SHOP_FILTER_PARAM, String(id))
        return next
      },
      { replace: true },
    )

  return [shopId, setShopId] as const
}
