import { describe, expect, it } from 'vitest'
import { matchesQuery, normalizeQuery } from './search'

describe('normalizeQuery', () => {
  it('trims and lowercases', () => {
    expect(normalizeQuery('  Flora ART ')).toBe('flora art')
  })
})

describe('matchesQuery', () => {
  it('matches everything for an empty or blank query', () => {
    expect(matchesQuery('', 'anything')).toBe(true)
    expect(matchesQuery('   ', 'anything')).toBe(true)
  })

  it('matches case-insensitively against any value', () => {
    expect(matchesQuery('flora', 'Sweet Dreams', 'Flora Art')).toBe(true)
    expect(matchesQuery('dreams', 'Sweet Dreams')).toBe(true)
  })

  it('matches numbers by their string form', () => {
    expect(matchesQuery('12', 12)).toBe(true)
    expect(matchesQuery('99', 12)).toBe(false)
  })

  it('ignores null and undefined values', () => {
    expect(matchesQuery('x', null, undefined)).toBe(false)
  })
})
