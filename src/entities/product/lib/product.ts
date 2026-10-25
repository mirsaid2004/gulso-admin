import type { PillTone } from '@/shared/ui'
import type { Product, ProductStatus } from '../model/types'

export function discountedPrice(product: Pick<Product, 'price' | 'discount'>): number {
  if (!product.discount) return product.price
  return Math.round(product.price * (1 - product.discount / 100))
}

/** A product is hidden when the seller/maintainer hid it or its shop is suspended. */
export function getProductStatus(product: Pick<Product, 'hidden' | 'stock'>, shopSuspended: boolean): ProductStatus {
  if (product.hidden || shopSuspended) return 'HIDDEN'
  if (product.stock === 0) return 'OUT'
  return 'ACTIVE'
}

export function getProductBadge(status: ProductStatus, shopSuspended: boolean): { label: string; tone: PillTone } {
  switch (status) {
    case 'HIDDEN':
      return { label: shopSuspended ? 'SHOP SUSPENDED' : 'HIDDEN', tone: 'rose' }
    case 'OUT':
      return { label: 'OUT OF STOCK', tone: 'stockOut' }
    case 'ACTIVE':
      return { label: 'IN STOCK', tone: 'success' }
  }
}
