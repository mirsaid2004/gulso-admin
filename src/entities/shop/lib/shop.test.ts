import { describe, expect, it } from 'vitest'
import type { Shop } from '../model/types'
import { findShop, getShopStatus, shopsOwnedBy, UNKNOWN_SHOP } from './shop'

const shop = (patch: Partial<Shop>): Shop => ({
  id: 1,
  name: 'Flora Art',
  ownerId: 123,
  categories: ['FLOWERS'],
  commission: 10,
  suspended: false,
  ...patch,
})

describe('getShopStatus', () => {
  it('prefers SUSPENDED over NEW', () => {
    expect(getShopStatus(shop({ suspended: true, isNew: true }))).toBe('SUSPENDED')
  })

  it('is NEW for freshly opened shops', () => {
    expect(getShopStatus(shop({ isNew: true }))).toBe('NEW')
  })

  it('is ACTIVE otherwise', () => {
    expect(getShopStatus(shop({}))).toBe('ACTIVE')
  })
})

describe('findShop / shopsOwnedBy', () => {
  const shops = [shop({ id: 1, ownerId: 5 }), shop({ id: 2, ownerId: 6 }), shop({ id: 3, ownerId: 5 })]

  it('finds by id, falling back to a placeholder', () => {
    expect(findShop(shops, 2).id).toBe(2)
    expect(findShop(shops, 99)).toBe(UNKNOWN_SHOP)
  })

  it('lists the shops of one owner', () => {
    expect(shopsOwnedBy(shops, 5).map((s) => s.id)).toEqual([1, 3])
    expect(shopsOwnedBy(shops, 7)).toEqual([])
  })
})
