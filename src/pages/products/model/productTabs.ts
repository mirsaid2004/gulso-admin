import type { ProductStatus } from '@/entities/product'

export type ProductTab = 'ALL' | ProductStatus

export const PRODUCT_TABS: Array<{ key: ProductTab; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'In stock' },
  { key: 'OUT', label: 'Out of stock' },
  { key: 'HIDDEN', label: 'Hidden' },
]

export const matchesProductTab = (status: ProductStatus, tab: ProductTab) => tab === 'ALL' || status === tab
