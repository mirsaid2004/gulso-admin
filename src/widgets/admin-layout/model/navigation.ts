import { ClipboardCheck, Package, ShoppingCart, Store, Users, type LucideIcon } from 'lucide-react'
import { PAGE_META, ROUTES, type RouteKey } from '@/shared/config'

export interface NavItem {
  key: RouteKey
  to: string
  label: string
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
  label: PAGE_META[key].title,
  icon: ICONS[key],
}))
