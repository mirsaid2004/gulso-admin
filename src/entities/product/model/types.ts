import type { Category } from '@/shared/config'

export interface Product {
  id: number
  shopId: number
  name: string
  category: Category
  /** Base price, UZS */
  price: number
  /** Discount, percent (0–100) */
  discount: number
  stock: number
  rating: number
  reviewCount: number
  imageUrl: string
  hidden: boolean
}

export type ProductPatch = Partial<Omit<Product, 'id'>>

export type ProductStatus = 'ACTIVE' | 'OUT' | 'HIDDEN'
