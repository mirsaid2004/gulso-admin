import type { TFunction } from 'i18next'
import { CATEGORIES, categoryEmoji } from '@/shared/config'
import { DELIVERY_TYPES, ORDER_STATUSES } from '@/entities/order'
import { ROLES } from '@/entities/user'
import type { FieldDef, FieldOption } from './types'

type Named = { id: number; name: string }

const toOptions = (items: Named[]): FieldOption[] => items.map((x) => ({ value: x.id, label: x.name }))
const categoryOptions = (t: TFunction): FieldOption[] =>
  CATEGORIES.map((c) => ({ value: c, label: `${categoryEmoji(c)} ${t(`categories.${c}`)}` }))

export function shopFields(t: TFunction, users: Named[]): FieldDef[] {
  return [
    { key: 'name', label: t('edit.fields.shopName'), type: 'text' },
    { key: 'ownerId', label: t('edit.fields.owner'), type: 'choice', options: toOptions(users) },
    { key: 'categories', label: t('edit.fields.categories'), type: 'multi', options: categoryOptions(t) },
    { key: 'commission', label: t('edit.fields.commission'), type: 'number', suffix: '%' },
    { key: 'suspended', label: t('edit.fields.status'), type: 'toggle', hint: t('edit.fields.suspendedHint') },
  ]
}

export function productFields(t: TFunction, shops: Named[]): FieldDef[] {
  return [
    { key: 'name', label: t('edit.fields.productName'), type: 'text' },
    { key: 'shopId', label: t('edit.fields.shop'), type: 'choice', options: toOptions(shops) },
    { key: 'category', label: t('edit.fields.category'), type: 'choice', options: categoryOptions(t) },
    { key: 'price', label: t('edit.fields.price'), type: 'number', suffix: t('common.currency') },
    { key: 'discount', label: t('edit.fields.discount'), type: 'number', suffix: '%' },
    { key: 'stock', label: t('edit.fields.stock'), type: 'number', suffix: t('common.pcsUnit') },
    { key: 'hidden', label: t('edit.fields.visibility'), type: 'toggle', hint: t('edit.fields.hiddenHint') },
  ]
}

export function orderFields(t: TFunction, users: Named[], shops: Named[]): FieldDef[] {
  return [
    {
      key: 'status',
      label: t('edit.fields.status'),
      type: 'choice',
      options: ORDER_STATUSES.map((s) => ({ value: s, label: t(`orders.status.${s}.tab`) })),
    },
    {
      key: 'deliveryType',
      label: t('edit.fields.deliveryType'),
      type: 'choice',
      options: DELIVERY_TYPES.map((d) => ({ value: d, label: t(`orders.delivery.${d}.title`) })),
    },
    { key: 'userId', label: t('edit.fields.customer'), type: 'choice', options: toOptions(users) },
    { key: 'shopId', label: t('edit.fields.shop'), type: 'choice', options: toOptions(shops) },
    { key: 'items', label: t('edit.fields.items'), type: 'text' },
    { key: 'total', label: t('edit.fields.total'), type: 'number', suffix: t('common.currency') },
  ]
}

export function userFields(t: TFunction): FieldDef[] {
  return [
    { key: 'name', label: t('edit.fields.fullName'), type: 'text' },
    { key: 'phone', label: t('edit.fields.phone'), type: 'text' },
    {
      key: 'roles',
      label: t('edit.fields.roles'),
      type: 'multi',
      options: ROLES.map((r) => ({ value: r, label: t(`users.roles.${r}.title`) })),
    },
    { key: 'blocked', label: t('edit.fields.access'), type: 'toggle', hint: t('edit.fields.blockedHint') },
  ]
}
