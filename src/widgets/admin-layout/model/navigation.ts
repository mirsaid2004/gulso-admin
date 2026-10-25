import { ClipboardCheck, Package, ShoppingCart, Store, Users, type LucideIcon } from 'lucide-react'
import { ROUTES, type RouteKey } from '@/shared/config'

export interface NavItem {
  /** Also the `pages.<key>` translation namespace */
  key: RouteKey
  to: string
  icon: LucideIcon
}

const ICONS: Record<RouteKey, LucideIcon> = {
  requests: ClipboardCheck,
  shops: Store,
  products: Package,
  orders: ShoppingCart,
  users: Users,
}

export const NAV_ITEMS: NavItem[] = (Object.keys(ROUTES) as RouteKey[]).map((key) => ({
  key,
  to: ROUTES[key],
  icon: ICONS[key],
}))
