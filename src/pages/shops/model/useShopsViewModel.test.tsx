import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { db } from '@/mocks/db'
import { renderHookWithProviders } from '@/shared/test/render'
import { useShopsViewModel } from './useShopsViewModel'

async function setup() {
  const view = renderHookWithProviders(() => useShopsViewModel())
  await waitFor(() => expect(view.result.current.rows).toHaveLength(4))
  // stats depend on products and orders, which load in parallel
  await waitFor(() => expect(view.result.current.rows[0].stats.productCount).toBe(3))
  return view
}

describe('useShopsViewModel', () => {
  it('joins owners and computes stats per shop', async () => {
    const { result } = await setup()
    const gullar = result.current.rows.find((r) => r.shop.id === 1)!

    expect(gullar.ownerName).toBe('Mirsaid')
    expect(gullar.categories).toBe('Flowers')
    expect(gullar.stats).toEqual({ productCount: 3, orderCount: 3, revenue: 370500 })
  })

  it('counts and filters by tab', async () => {
    db.shops.find((s) => s.id === 3)!.suspended = true
    const { result } = await setup()

    expect(result.current.tabs.map((t) => [t.key, t.count])).toEqual([
      ['ALL', 4],
      ['ACTIVE', 3],
      ['SUSPENDED', 1],
    ])
    act(() => result.current.setTab('SUSPENDED'))
    expect(result.current.rows.map((r) => r.shop.name)).toEqual(['Le Dessert'])
  })

  it('searches by shop or owner name', async () => {
    const { result } = await setup()

    act(() => result.current.setSearch('aziza'))
    expect(result.current.rows.map((r) => r.shop.name)).toEqual(['Sweet Dreams'])

    act(() => result.current.setSearch('FLORA'))
    expect(result.current.rows.map((r) => r.shop.name)).toEqual(['Flora Art'])
  })

  it('toggles suspension through the API', async () => {
    const { result } = await setup()

    act(() => result.current.toggleSuspension(result.current.rows[1].shop))

    await waitFor(() => expect(result.current.rows[1].shop.suspended).toBe(true))
    expect(result.current.rows[1].status).toBe('SUSPENDED')
  })

  it('exposes the drawer schema for the shop being edited', async () => {
    const { result } = await setup()

    act(() => result.current.edit(result.current.rows[3].shop))

    expect(result.current.editing?.id).toBe(4)
    expect(result.current.editing?.original).toMatchObject({ name: 'Flora Art', commission: 10 })
    expect(result.current.editing?.fields.map((f) => f.key)).toEqual([
      'name',
      'ownerId',
      'categories',
      'commission',
      'suspended',
    ])
  })
})
