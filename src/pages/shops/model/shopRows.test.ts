import { describe, expect, it } from 'vitest'
import { computeShopStats, matchesShopTab } from './shopRows'

describe('matchesShopTab', () => {
  it('splits shops by suspension', () => {
    expect(matchesShopTab({ suspended: true }, 'ALL')).toBe(true)
    expect(matchesShopTab({ suspended: true }, 'SUSPENDED')).toBe(true)
    expect(matchesShopTab({ suspended: true }, 'ACTIVE')).toBe(false)
    expect(matchesShopTab({ suspended: false }, 'ACTIVE')).toBe(true)
  })
})

describe('computeShopStats', () => {
  const products = [{ shopId: 1 }, { shopId: 1 }, { shopId: 2 }]
  const orders = [
    { shopId: 1, status: 'COMPLETED', total: 100 },
    { shopId: 1, status: 'CANCELLED', total: 999 },
    { shopId: 1, status: 'COMPLETED', total: 50 },
    { shopId: 2, status: 'COMPLETED', total: 7 },
  ]

  it('counts products and orders and sums completed revenue only', () => {
    expect(computeShopStats(1, products, orders)).toEqual({ productCount: 2, orderCount: 3, revenue: 150 })
  })

  it('returns zeros for a shop with no activity', () => {
    expect(computeShopStats(9, products, orders)).toEqual({ productCount: 0, orderCount: 0, revenue: 0 })
  })
})
