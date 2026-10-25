import { describe, expect, it } from 'vitest'
import {
  formatAge,
  formatDate,
  formatDateTime,
  formatNumber,
  formatShortDateTime,
  formatUzs,
  monogram,
  pluralize,
} from './format'

describe('formatNumber', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1 000'],
    [339300, '339 300'],
    [1234567, '1 234 567'],
  ])('%d → %s', (input, expected) => {
    expect(formatNumber(input)).toBe(expected)
  })

  it('rounds fractional amounts', () => {
    expect(formatNumber(1234.6)).toBe('1 235')
  })
})

describe('formatUzs', () => {
  it('appends the currency', () => {
    expect(formatUzs(120000)).toBe('120 000 UZS')
  })
})

describe('date formatting', () => {
  it('formats a date-only string as a local calendar date', () => {
    expect(formatDate('2026-01-09')).toBe('Jan 9, 2026')
  })

  it('formats short date-time with zero-padded time', () => {
    expect(formatShortDateTime('2026-10-14T09:05:00')).toBe('Oct 14, 09:05')
  })

  it('formats full date-time', () => {
    expect(formatDateTime('2026-10-14T17:40:00')).toBe('Oct 14, 2026 · 17:40')
  })
})

describe('formatAge', () => {
  const now = new Date('2026-10-14T12:00:00')

  it.each([
    ['2026-10-14T11:59:40', 'now'],
    ['2026-10-14T11:15:00', '45m'],
    ['2026-10-14T10:00:00', '2h'],
    ['2026-10-13T11:00:00', '1d'],
    ['2026-10-02T12:00:00', '12d'],
  ])('%s → %s', (iso, expected) => {
    expect(formatAge(iso, now)).toBe(expected)
  })
})

describe('monogram', () => {
  it.each([
    ['Bake & Bloom', 'BB'],
    ["Gullar do'koni", 'GD'],
    ['Mirsaid', 'M'],
    ['Fast Flowers 24', 'FF'],
    ['  le   dessert ', 'LD'],
  ])('%s → %s', (name, expected) => {
    expect(monogram(name)).toBe(expected)
  })
})

describe('pluralize', () => {
  it('uses the singular for one', () => {
    expect(pluralize(1, 'change')).toBe('1 change')
  })

  it('uses the plural otherwise', () => {
    expect(pluralize(3, 'change')).toBe('3 changes')
    expect(pluralize(0, 'shop')).toBe('0 shops')
  })
})
