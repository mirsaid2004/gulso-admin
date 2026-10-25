import { describe, expect, it } from 'vitest'
import { getOwnerTag } from './ownerTag'

describe('getOwnerTag', () => {
  it('flags blocked users first', () => {
    expect(getOwnerTag({ blocked: true }, ['Flora Art'])).toEqual({ label: 'Blocked user', tone: 'rose' })
  })

  it('lists the shops of an existing seller', () => {
    expect(getOwnerTag({ blocked: false }, ['Flora Art'])).toEqual({
      label: 'Existing seller · 1 shop: Flora Art',
      tone: 'emerald',
    })
    expect(getOwnerTag({ blocked: false }, ["Gullar do'koni", 'Flora Art']).label).toBe(
      "Existing seller · 2 shops: Gullar do'koni, Flora Art",
    )
  })

  it('marks a first-time seller', () => {
    expect(getOwnerTag({ blocked: false }, [])).toEqual({ label: 'First shop · new seller', tone: 'slate' })
  })
})
