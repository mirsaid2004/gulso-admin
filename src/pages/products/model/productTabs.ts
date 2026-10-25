import type { ProductStatus } from '@/entities/product'

export type ProductTab = 'ALL' | ProductStatus

export const PRODUCT_TABS: ProductTab[] = ['ALL', 'ACTIVE', 'OUT', 'HIDDEN']

export const matchesProductTab = (status: ProductStatus, tab: ProductTab) => tab === 'ALL' || status === tab
