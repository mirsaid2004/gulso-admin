import { http } from 'msw'
import { DEFAULT_COMMISSION } from '@/entities/shop'
import type { ShopRequest } from '@/entities/shop-request'
import { db, nextId } from '../db'
import { api, currentMaintainer, fail, notFound, ok } from './utils'

function findPending(id: unknown): ShopRequest | Response {
  const request = db.shopRequests.find((r) => r.id === Number(id))
  if (!request) return notFound('Shop request')
  if (request.status !== 'PENDING') return fail(409, 'NOT_PENDING', 'Only pending requests can be reviewed')
  return request
}

async function readNote(request: Request): Promise<string> {
  const body = (await request.json().catch(() => ({}))) as { note?: string }
  return body.note?.trim() ?? ''
}

export const shopRequestHandlers = [
  http.get(api('/admin/shop-requests'), () => ok(db.shopRequests)),

  http.post(api('/admin/shop-requests/:id/approve'), ({ params, request }) => {
    const found = findPending(params.id)
    if (found instanceof Response) return found

    const shopId = nextId(db.shops)
    db.shops.push({
      id: shopId,
      name: found.name,
      ownerId: found.ownerId,
      categories: [...found.categories],
      commission: DEFAULT_COMMISSION,
      suspended: false,
      isNew: true,
    })
    const owner = db.users.find((u) => u.id === found.ownerId)
    if (owner && !owner.roles.includes('SELLER')) owner.roles.push('SELLER')

    found.status = 'APPROVED'
    found.note = `Approved by ${currentMaintainer(request)?.name} · opened as shop ID ${shopId}`
    return ok({ request: found, shopId })
  }),

  http.post(api('/admin/shop-requests/:id/request-changes'), async ({ params, request }) => {
    const found = findPending(params.id)
    if (found instanceof Response) return found
    const note = await readNote(request)
    if (!note) return fail(400, 'NOTE_REQUIRED', 'A note for the seller is required')
    found.status = 'CHANGES_REQUESTED'
    found.note = note
    return ok(found)
  }),

  http.post(api('/admin/shop-requests/:id/reject'), async ({ params, request }) => {
    const found = findPending(params.id)
    if (found instanceof Response) return found
    const note = await readNote(request)
    if (!note) return fail(400, 'NOTE_REQUIRED', 'A rejection reason is required')
    found.status = 'REJECTED'
    found.note = note
    return ok(found)
  }),
]
