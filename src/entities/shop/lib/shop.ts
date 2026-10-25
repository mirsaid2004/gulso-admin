import type { Shop, ShopStatus } from '../model/types'
import { DEFAULT_COMMISSION } from '../model/constants'

export const UNKNOWN_SHOP: Shop = {
  id: 0,
  name: '—',
  ownerId: 0,
  categories: [],
  commission: DEFAULT_COMMISSION,
  suspended: false,
}

export function findShop(shops: Shop[], id: number): Shop {
  return shops.find((s) => s.id === id) ?? UNKNOWN_SHOP
}

export function getShopStatus(shop: Shop): ShopStatus {
  if (shop.suspended) return 'SUSPENDED'
  if (shop.isNew) return 'NEW'
  return 'ACTIVE'
}

export function shopsOwnedBy(shops: Shop[], ownerId: number): Shop[] {
  return shops.filter((s) => s.ownerId === ownerId)
}
