import type { Order } from '../model/types'

/** Platform cut of an order total, rounded to whole UZS. */
export function commissionAmount(total: number, ratePercent: number): number {
  return Math.round((total * ratePercent) / 100)
}

/** Finished orders (completed or already cancelled) can't be cancelled. */
export function isCancellable(order: Pick<Order, 'status'>): boolean {
  return order.status !== 'COMPLETED' && order.status !== 'CANCELLED'
}
