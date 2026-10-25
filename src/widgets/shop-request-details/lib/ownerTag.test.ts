import { describe, expect, it } from 'vitest'
import { getOwnerTag } from './ownerTag'

describe('getOwnerTag', () => {
  it('flags blocked users first, even if they own shops', () => {
    expect(getOwnerTag({ blocked: true }, 2)).toEqual({ kind: 'blocked', tone: 'rose' })
  })

  it('marks existing sellers', () => {
    expect(getOwnerTag({ blocked: false }, 1)).toEqual({ kind: 'existing', tone: 'emerald' })
  })

  it('marks a first-time seller', () => {
    expect(getOwnerTag({ blocked: false }, 0)).toEqual({ kind: 'first', tone: 'slate' })
  })
})
