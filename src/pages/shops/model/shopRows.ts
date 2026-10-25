import type { Shop } from '@/entities/shop'

export type ShopTab = 'ALL' | 'ACTIVE' | 'SUSPENDED'

export const SHOP_TABS: ShopTab[] = ['ALL', 'ACTIVE', 'SUSPENDED']

export function matchesShopTab(shop: Pick<Shop, 'suspended'>, tab: ShopTab): boolean {
  if (tab === 'ALL') return true
  return tab === 'SUSPENDED' ? shop.suspended : !shop.suspended
}

export interface ShopStats {
  productCount: number
  orderCount: number
  /** Sum of completed order totals, UZS */
  revenue: number
}

export function computeShopStats(
  shopId: number,
  products: Array<{ shopId: number }>,
  orders: Array<{ shopId: number; status: string; total: number }>,
): ShopStats {
  const shopOrders = orders.filter((o) => o.shopId === shopId)
  return {
    productCount: products.filter((p) => p.shopId === shopId).length,
    orderCount: shopOrders.length,
    revenue: shopOrders.filter((o) => o.status === 'COMPLETED').reduce((sum, o) => sum + o.total, 0),
  }
}
