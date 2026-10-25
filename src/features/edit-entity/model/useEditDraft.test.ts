import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useEditDraft } from './useEditDraft'
import type { FieldDef } from './types'

const fields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'stock', label: 'Stock', type: 'number', suffix: 'pcs' },
  { key: 'roles', label: 'Roles', type: 'multi', options: [] },
]
const original = { name: 'Tulip Basket', stock: 14, roles: ['USER'] }

describe('useEditDraft', () => {
  it('starts clean with a copy of the original', () => {
    const { result } = renderHook(() => useEditDraft(fields, original))
    expect(result.current.draft).toEqual(original)
    expect(result.current.draft).not.toBe(original)
    expect(result.current.dirtyCount).toBe(0)
    expect(result.current.dirtyLabel).toBe('No changes')
  })

  it('tracks edited fields and builds a normalized patch', () => {
    const { result } = renderHook(() => useEditDraft(fields, original))

    act(() => result.current.setField('stock', '20'))
    act(() => result.current.toggleOption('roles', 'SELLER'))

    expect(result.current.isDirty('stock')).toBe(true)
    expect(result.current.isDirty('name')).toBe(false)
    expect(result.current.dirtyLabel).toBe('2 changes')
    expect(result.current.getPatch()).toEqual({ stock: 20, roles: ['USER', 'SELLER'] })
  })

  it('is clean again when an edit is reverted', () => {
    const { result } = renderHook(() => useEditDraft(fields, original))

    act(() => result.current.setField('name', 'Other'))
    act(() => result.current.setField('name', 'Tulip Basket'))

    expect(result.current.dirtyCount).toBe(0)
    expect(original.name).toBe('Tulip Basket')
  })
})
