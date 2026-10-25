import type { ProductStatus } from './types'

export const PRODUCT_STATUS_TAB: Record<ProductStatus, string> = {
  ACTIVE: 'In stock',
  OUT: 'Out of stock',
  HIDDEN: 'Hidden',
}
