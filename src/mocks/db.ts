import * as seed from './data/seed'

function fresh() {
  return {
    viewer: structuredClone(seed.viewer),
    users: structuredClone(seed.users),
    shops: structuredClone(seed.shops),
    products: structuredClone(seed.products),
    orders: structuredClone(seed.orders),
    shopRequests: structuredClone(seed.shopRequests),
  }
}

/** In-memory database. Mutations live until the page reloads (or `resetDb()` in tests). */
export const db = fresh()

export function resetDb() {
  Object.assign(db, fresh())
}

export function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
}
