import { describe, expect, it } from 'vitest'
import { discountedPrice, getProductBadge, getProductStatus } from './product'

describe('discountedPrice', () => {
  it('returns the base price without a discount', () => {
    expect(discountedPrice({ price: 120000, discount: 0 })).toBe(120000)
  })

  it('applies and rounds the percentage discount', () => {
    expect(discountedPrice({ price: 390000, discount: 13 })).toBe(339300)
    expect(discountedPrice({ price: 999, discount: 33 })).toBe(669)
  })
})

describe('getProductStatus', () => {
  it('is ACTIVE when visible and in stock', () => {
    expect(getProductStatus({ hidden: false, stock: 3 }, false)).toBe('ACTIVE')
  })

  it('is OUT when stock is zero', () => {
    expect(getProductStatus({ hidden: false, stock: 0 }, false)).toBe('OUT')
  })

  it('is HIDDEN when hidden, even if out of stock', () => {
    expect(getProductStatus({ hidden: true, stock: 0 }, false)).toBe('HIDDEN')
  })

  it('is HIDDEN when the shop is suspended', () => {
    expect(getProductStatus({ hidden: false, stock: 10 }, true)).toBe('HIDDEN')
  })
})

describe('getProductBadge', () => {
  it('explains when a product is hidden because of its shop', () => {
    expect(getProductBadge('HIDDEN', true)).toEqual({ key: 'SHOP_SUSPENDED', tone: 'rose' })
    expect(getProductBadge('HIDDEN', false)).toEqual({ key: 'HIDDEN', tone: 'rose' })
  })

  it('maps stock states to their badges', () => {
    expect(getProductBadge('OUT', false)).toEqual({ key: 'OUT', tone: 'stockOut' })
    expect(getProductBadge('ACTIVE', false)).toEqual({ key: 'ACTIVE', tone: 'success' })
  })
})
