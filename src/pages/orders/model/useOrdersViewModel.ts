import { useState } from 'react'
import {
  commissionAmount,
  isCancellable,
  ORDER_STATUSES,
  useOrdersQuery,
  type Order,
  type OrderStatus,
} from '@/entities/order'
import { findShop, useShopsQuery } from '@/entities/shop'
import { findUser, useUsersQuery } from '@/entities/user'
import { useCancelOrder } from '@/features/cancel-order'
import { orderFields, toDraft, useEntityEditor } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import { formatNumber, formatShortDateTime, matchesQuery, useShopFilterParam } from '@/shared/lib'

export type OrderTab = 'ALL' | OrderStatus

const ORDER_TABS: OrderTab[] = ['ALL', ...ORDER_STATUSES]

const matchesOrderTab = (order: Order, tab: OrderTab) => tab === 'ALL' || order.status === tab

export function useOrdersViewModel() {
  const { t, language, money } = useLocale()
  const ordersQuery = useOrdersQuery()
  const usersQuery = useUsersQuery()
  const shopsQuery = useShopsQuery()
  const cancellation = useCancelOrder()
  const editor = useEntityEditor()
  const [shopFilter, setShopFilter] = useShopFilterParam()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<OrderTab>('ALL')

  const orders = ordersQuery.data ?? []
  const users = usersQuery.data ?? []
  const shops = shopsQuery.data ?? []

  const scoped = orders.filter((o) => shopFilter == null || o.shopId === shopFilter)

  const rows = scoped
    .filter((o) => {
      const customer = findUser(users, o.userId)
      return matchesOrderTab(o, tab) && matchesQuery(search, o.id, customer.name, customer.phone)
    })
    .map((order) => {
      const customer = findUser(users, order.userId)
      const shop = findShop(shops, order.shopId)
      return {
        order,
        title: t('orders.orderNumber', { id: order.id }),
        date: formatShortDateTime(order.createdAt, language),
        customerName: customer.name,
        customerPhone: customer.phone,
        shopName: shop.name,
        total: money(order.total),
        commission: `${formatNumber(commissionAmount(order.total, shop.commission))} · ${shop.commission}%`,
        statusLabel: t(`orders.status.${order.status}.label`),
        deliveryLabel: t(`orders.delivery.${order.deliveryType}.label`),
        canCancel: isCancellable(order),
        isCancelling: cancellation.pendingId === order.id,
      }
    })

  const editing = editor.target && orders.find((o) => o.id === editor.target!.id)

  return {
    isLoading: ordersQuery.isLoading,
    search,
    setSearch,
    tab,
    setTab,
    tabs: ORDER_TABS.map((key) => ({
      key,
      label: key === 'ALL' ? t('orders.all') : t(`orders.status.${key}.tab`),
      count: scoped.filter((o) => matchesOrderTab(o, key)).length,
    })),
    rows,
    shopFilterName: shopFilter != null ? findShop(shops, shopFilter).name : null,
    clearShopFilter: () => setShopFilter(null),
    filterByShop: (order: Order) => setShopFilter(order.shopId),
    cancel: cancellation.cancel,
    edit: (order: Order) => editor.open({ kind: 'order', id: order.id }),
    editor,
    editing: editing ? { id: editing.id, original: toDraft(editing), fields: orderFields(t, users, shops) } : null,
  }
}
