import { http } from 'msw'
import type { User } from '@/entities/user'
import type { Shop } from '@/entities/shop'
import type { Product } from '@/entities/product'
import type { Order } from '@/entities/order'
import { db } from '../db'
import { api, applyPatch, notFound, ok } from './utils'

type Collection = 'users' | 'shops' | 'products' | 'orders'
type EntityOf = { users: User; shops: Shop; products: Product; orders: Order }

const LABEL: Record<Collection, string> = { users: 'User', shops: 'Shop', products: 'Product', orders: 'Order' }

/** GET /admin/:collection and PATCH /admin/:collection/:id for a plain CRUD resource. */
function resource<C extends Collection>(collection: C) {
  return [
    http.get(api(`/admin/${collection}`), () => ok(db[collection])),
    http.patch(api(`/admin/${collection}/:id`), async ({ params, request }) => {
      const items = db[collection] as EntityOf[C][]
      const entity = items.find((x) => x.id === Number(params.id))
      if (!entity) return notFound(LABEL[collection])
      const patch = (await request.json()) as Partial<EntityOf[C]>
      return ok(applyPatch(entity, patch))
    }),
  ]
}

export const resourceHandlers = [
  http.get(api('/admin/me'), () => ok(db.viewer)),
  ...resource('users'),
  ...resource('shops'),
  ...resource('products'),
  ...resource('orders'),
]
