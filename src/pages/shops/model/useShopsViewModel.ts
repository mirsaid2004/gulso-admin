import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShopStatus, useShopsQuery, type Shop } from '@/entities/shop'
import { findUser, useUsersQuery } from '@/entities/user'
import { useProductsQuery } from '@/entities/product'
import { useOrdersQuery } from '@/entities/order'
import { useToggleShopSuspension } from '@/features/moderate-shop'
import { shopFields, toDraft, useEntityEditor } from '@/features/edit-entity'
import { categoryLabel, ROUTES, SHOP_FILTER_PARAM } from '@/shared/config'
import { matchesQuery } from '@/shared/lib'
import { computeShopStats, matchesShopTab, SHOP_TABS, type ShopTab } from './shopRows'

export function useShopsViewModel() {
  const navigate = useNavigate()
  const shopsQuery = useShopsQuery()
  const usersQuery = useUsersQuery()
  const productsQuery = useProductsQuery()
  const ordersQuery = useOrdersQuery()
  const suspension = useToggleShopSuspension()
  const editor = useEntityEditor()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<ShopTab>('ALL')

  const shops = shopsQuery.data ?? []
  const users = usersQuery.data ?? []

  const rows = shops
    .filter((s) => matchesShopTab(s, tab) && matchesQuery(search, s.name, findUser(users, s.ownerId).name))
    .map((shop) => ({
      shop,
      ownerName: findUser(users, shop.ownerId).name,
      categories: shop.categories.map(categoryLabel).join(', '),
      status: getShopStatus(shop),
      stats: computeShopStats(shop.id, productsQuery.data ?? [], ordersQuery.data ?? []),
      isToggling: suspension.pendingId === shop.id,
    }))

  const editing = editor.target && shops.find((s) => s.id === editor.target!.id)
  const goFiltered = (route: string, shop: Shop) => navigate(`${route}?${SHOP_FILTER_PARAM}=${shop.id}`)

  return {
    isLoading: shopsQuery.isLoading,
    search,
    setSearch,
    tab,
    setTab,
    tabs: SHOP_TABS.map((t) => ({ ...t, count: shops.filter((s) => matchesShopTab(s, t.key)).length })),
    rows,
    toggleSuspension: suspension.toggle,
    viewProducts: (shop: Shop) => goFiltered(ROUTES.products, shop),
    viewOrders: (shop: Shop) => goFiltered(ROUTES.orders, shop),
    edit: (shop: Shop) => editor.open({ kind: 'shop', id: shop.id }),
    editor,
    editing: editing ? { id: editing.id, original: toDraft(editing), fields: shopFields(users) } : null,
  }
}
