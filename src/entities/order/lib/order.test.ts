import { describe, expect, it } from 'vitest'
import { commissionAmount, isCancellable } from './order'

describe('commissionAmount', () => {
  it('takes the percentage of the total', () => {
    expect(commissionAmount(339300, 10)).toBe(33930)
  })

  it('rounds to whole UZS', () => {
    expect(commissionAmount(85005, 15)).toBe(12751)
  })

  it('is zero for a zero rate', () => {
    expect(commissionAmount(100000, 0)).toBe(0)
  })
})

describe('isCancellable', () => {
  it.each(['ACCEPTED', 'PREPARING', 'IN_DELIVERY'] as const)('%s can be cancelled', (status) => {
    expect(isCancellable({ status })).toBe(true)
  })

  it.each(['COMPLETED', 'CANCELLED'] as const)('%s cannot be cancelled', (status) => {
    expect(isCancellable({ status })).toBe(false)
  })
})
