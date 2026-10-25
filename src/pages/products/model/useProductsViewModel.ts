import { useState } from 'react'
import {
  discountedPrice,
  getProductBadge,
  getProductStatus,
  useProductsQuery,
  type Product,
} from '@/entities/product'
import { findShop, useShopsQuery } from '@/entities/shop'
import { useToggleProductVisibility } from '@/features/moderate-product'
import { productFields, toDraft, useEntityEditor } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import { matchesQuery, useShopFilterParam } from '@/shared/lib'
import { matchesProductTab, PRODUCT_TABS, type ProductTab } from './productTabs'

export function useProductsViewModel() {
  const { t, money } = useLocale()
  const productsQuery = useProductsQuery()
  const shopsQuery = useShopsQuery()
  const visibility = useToggleProductVisibility()
  const editor = useEntityEditor()
  const [shopFilter, setShopFilter] = useShopFilterParam()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<ProductTab>('ALL')

  const shops = shopsQuery.data ?? []
  const products = productsQuery.data ?? []

  const scoped = products
    .filter((p) => shopFilter == null || p.shopId === shopFilter)
    .map((product) => {
      const shop = findShop(shops, product.shopId)
      const status = getProductStatus(product, shop.suspended)
      return { product, shop, status }
    })

  const rows = scoped
    .filter(({ product, shop, status }) => matchesProductTab(status, tab) && matchesQuery(search, product.name, shop.name))
    .map(({ product, shop, status }) => {
      const badge = getProductBadge(status, shop.suspended)
      return {
        product,
        shopName: shop.name,
        category: t(`categories.${product.category}`),
        price: money(discountedPrice(product)),
        stock: t('common.pcs', { count: product.stock }),
        status,
        badge: { tone: badge.tone, label: t(`products.badge.${badge.key}`) },
        isToggling: visibility.pendingId === product.id,
      }
    })

  const editing = editor.target && products.find((p) => p.id === editor.target!.id)

  return {
    isLoading: productsQuery.isLoading,
    search,
    setSearch,
    tab,
    setTab,
    tabs: PRODUCT_TABS.map((key) => ({
      key,
      label: t(`products.tabs.${key}`),
      count: scoped.filter((x) => matchesProductTab(x.status, key)).length,
    })),
    rows,
    shopFilterName: shopFilter != null ? findShop(shops, shopFilter).name : null,
    clearShopFilter: () => setShopFilter(null),
    filterByShop: (product: Product) => setShopFilter(product.shopId),
    toggleVisibility: visibility.toggle,
    edit: (product: Product) => editor.open({ kind: 'product', id: product.id }),
    editor,
    editing: editing ? { id: editing.id, original: toDraft(editing), fields: productFields(t, shops) } : null,
  }
}
