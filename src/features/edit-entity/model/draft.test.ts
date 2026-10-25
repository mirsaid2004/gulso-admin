import { describe, expect, it } from 'vitest'
import { buildPatch, dirtyKeys, isSameValue, normalizeValue, toggleInList } from './draft'
import type { FieldDef } from './types'

const fields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'commission', label: 'Commission', type: 'number', suffix: '%' },
  { key: 'categories', label: 'Categories', type: 'multi', options: [] },
  { key: 'suspended', label: 'Status', type: 'toggle', hint: '' },
]

const original = { name: 'Flora Art', commission: 10, categories: ['FLOWERS', 'GIFTS'], suspended: false }

describe('isSameValue', () => {
  it('compares numbers and their typed string form as equal', () => {
    expect(isSameValue(10, '10')).toBe(true)
  })

  it('ignores order in multi-selects', () => {
    expect(isSameValue(['A', 'B'], ['B', 'A'])).toBe(true)
    expect(isSameValue(['A'], ['A', 'B'])).toBe(false)
  })

  it('distinguishes booleans', () => {
    expect(isSameValue(true, false)).toBe(false)
  })
})

describe('dirtyKeys', () => {
  it('is empty for an untouched draft', () => {
    expect(dirtyKeys(fields, { ...original }, original)).toEqual([])
  })

  it('lists changed fields', () => {
    const draft = { ...original, commission: '15', categories: ['GIFTS', 'FLOWERS'], suspended: true }
    expect(dirtyKeys(fields, draft, original)).toEqual(['commission', 'suspended'])
  })
})

describe('normalizeValue', () => {
  it('coerces numbers and clamps negatives to zero', () => {
    expect(normalizeValue(fields[1], '15')).toBe(15)
    expect(normalizeValue(fields[1], '-4')).toBe(0)
    expect(normalizeValue(fields[1], 'abc')).toBe(0)
  })

  it('trims text', () => {
    expect(normalizeValue(fields[0], '  Flora  ')).toBe('Flora')
  })
})

describe('buildPatch', () => {
  it('contains only changed, normalized fields', () => {
    const draft = { ...original, name: ' Flora Art 2 ', commission: '12' }
    expect(buildPatch(fields, draft, original)).toEqual({ name: 'Flora Art 2', commission: 12 })
  })

  it('is empty when nothing changed', () => {
    expect(buildPatch(fields, { ...original }, original)).toEqual({})
  })
})

describe('toggleInList', () => {
  it('adds a missing value and removes a present one', () => {
    expect(toggleInList(['A'], 'B')).toEqual(['A', 'B'])
    expect(toggleInList(['A', 'B'], 'A')).toEqual(['B'])
  })
})
