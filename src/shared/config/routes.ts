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

export function routeKeyFromPath(pathname: string): RouteKey | undefined {
  return (Object.keys(ROUTES) as RouteKey[]).find((k) => pathname.startsWith(ROUTES[k]))
}
