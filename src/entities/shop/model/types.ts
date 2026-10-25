import type { Category } from '@/shared/config'

export interface Shop {
  id: number
  name: string
  ownerId: number
  categories: Category[]
  /** Platform commission, percent */
  commission: number
  suspended: boolean
  /** Opened recently from an approved shop request */
  isNew?: boolean
}

export type ShopPatch = Partial<Omit<Shop, 'id'>>

export type ShopStatus = 'ACTIVE' | 'NEW' | 'SUSPENDED'
