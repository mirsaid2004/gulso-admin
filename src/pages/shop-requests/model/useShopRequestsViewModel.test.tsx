import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '@/test/render'
import { useShopRequestsViewModel } from './useShopRequestsViewModel'

async function setup() {
  const view = renderHookWithProviders(() => useShopRequestsViewModel())
  await waitFor(() => expect(view.result.current.isLoading).toBe(false))
  return view
}

describe('useShopRequestsViewModel', () => {
  it('lists pending requests and selects the first by default', async () => {
    const { result } = await setup()

    expect(result.current.list.map((i) => i.request.name)).toEqual(['Bake & Bloom', 'Tulip House', 'Choco Lab'])
    expect(result.current.selectedId).toBe(41)
    expect(result.current.selected?.owner.name).toBe('Mirsaid')
    expect(result.current.selected?.ownerShops.map((s) => s.name)).toEqual(["Gullar do'koni", 'Flora Art'])
  })

  it('counts every status for the tabs', async () => {
    const { result } = await setup()

    expect(Object.fromEntries(result.current.tabs.map((t) => [t.key, t.count]))).toEqual({
      PENDING: 3,
      CHANGES_REQUESTED: 1,
      APPROVED: 0,
      REJECTED: 1,
    })
  })

  it('switching tabs selects the first request of that tab', async () => {
    const { result } = await setup()

    act(() => result.current.select(40))
    act(() => result.current.setTab('REJECTED'))

    expect(result.current.selected?.request.name).toBe('Fast Flowers 24')
  })

  it('searches by owner name and keeps a valid selection', async () => {
    const { result } = await setup()

    act(() => result.current.select(41))
    act(() => result.current.setSearch('timur'))

    expect(result.current.list.map((i) => i.request.name)).toEqual(['Choco Lab'])
    expect(result.current.selectedId).toBe(38)
  })

  it('shows category emojis and ages in list items', async () => {
    const { result } = await setup()
    const first = result.current.list[0]

    expect(first.emojis).toBe('🎂 🌸')
    expect(first.age).toBe('2h')
  })
})
