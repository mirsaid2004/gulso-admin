export const ROUTES = {
  requests: '/requests',
  shops: '/shops',
  products: '/products',
  orders: '/orders',
  users: '/users',
} as const

export type RouteKey = keyof typeof ROUTES

/** Query param used by Products and Orders to scope the list to one shop. */
export const SHOP_FILTER_PARAM = 'shop'

export const PAGE_META: Record<RouteKey, { title: string; subtitle: string; searchPlaceholder: string }> = {
  requests: {
    title: 'Shop requests',
    subtitle: 'New shops waiting for confirmation before they open',
    searchPlaceholder: 'Shop or owner name...',
  },
  shops: { title: 'Shops', subtitle: 'Every shop on Gulso', searchPlaceholder: 'Search shops...' },
  products: { title: 'Products', subtitle: 'All products across all shops', searchPlaceholder: 'Search products...' },
  orders: { title: 'Orders', subtitle: 'All orders across all shops', searchPlaceholder: 'Order #, customer or phone...' },
  users: { title: 'Users', subtitle: 'Buyers, sellers and maintainers', searchPlaceholder: 'Name or phone...' },
}

export function routeKeyFromPath(pathname: string): RouteKey | undefined {
  return (Object.keys(ROUTES) as RouteKey[]).find((k) => pathname.startsWith(ROUTES[k]))
}
