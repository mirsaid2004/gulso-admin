import { CATEGORIES, categoryWithEmoji } from '@/shared/config'
import { ORDER_STATUSES, ORDER_STATUS_META, DELIVERY_META, type DeliveryType } from '@/entities/order'
import { ROLES, ROLE_META } from '@/entities/user'
import type { FieldDef, FieldOption } from './types'

type Named = { id: number; name: string }

const toOptions = (items: Named[]): FieldOption[] => items.map((x) => ({ value: x.id, label: x.name }))
const categoryOptions: FieldOption[] = CATEGORIES.map((c) => ({ value: c, label: categoryWithEmoji(c) }))

export function shopFields(users: Named[]): FieldDef[] {
  return [
    { key: 'name', label: 'Shop name', type: 'text' },
    { key: 'ownerId', label: 'Owner', type: 'choice', options: toOptions(users) },
    { key: 'categories', label: 'Categories', type: 'multi', options: categoryOptions },
    { key: 'commission', label: 'Platform commission', type: 'number', suffix: '%' },
    { key: 'suspended', label: 'Status', type: 'toggle', hint: 'Suspended — hidden from buyers' },
  ]
}

export function productFields(shops: Named[]): FieldDef[] {
  return [
    { key: 'name', label: 'Product name', type: 'text' },
    { key: 'shopId', label: 'Shop', type: 'choice', options: toOptions(shops) },
    { key: 'category', label: 'Category', type: 'choice', options: categoryOptions },
    { key: 'price', label: 'Price', type: 'number', suffix: 'UZS' },
    { key: 'discount', label: 'Discount', type: 'number', suffix: '%' },
    { key: 'stock', label: 'Stock', type: 'number', suffix: 'pcs' },
    { key: 'hidden', label: 'Visibility', type: 'toggle', hint: 'Hidden from buyers' },
  ]
}

export function orderFields(users: Named[], shops: Named[]): FieldDef[] {
  return [
    {
      key: 'status',
      label: 'Status',
      type: 'choice',
      options: ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_META[s].tab })),
    },
    {
      key: 'deliveryType',
      label: 'Delivery type',
      type: 'choice',
      options: (Object.keys(DELIVERY_META) as DeliveryType[]).map((d) => ({ value: d, label: DELIVERY_META[d].title })),
    },
    { key: 'userId', label: 'Customer', type: 'choice', options: toOptions(users) },
    { key: 'shopId', label: 'Shop', type: 'choice', options: toOptions(shops) },
    { key: 'items', label: 'Items', type: 'text' },
    { key: 'total', label: 'Total', type: 'number', suffix: 'UZS' },
  ]
}

export function userFields(): FieldDef[] {
  return [
    { key: 'name', label: 'Full name', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'roles', label: 'Roles', type: 'multi', options: ROLES.map((r) => ({ value: r, label: ROLE_META[r].title })) },
    { key: 'blocked', label: 'Access', type: 'toggle', hint: "Blocked — can't log in or order" },
  ]
}
