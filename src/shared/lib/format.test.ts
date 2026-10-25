import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, formatNumber, formatShortDateTime, getAge, monogram } from './format'

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

describe('date formatting', () => {
  it('formats a date-only string as a local calendar date', () => {
    expect(formatDate('2026-01-09')).toBe('Jan 9, 2026')
  })

  it('formats short date-time with 24h zero-padded time', () => {
    expect(formatShortDateTime('2026-10-14T09:05:00')).toBe('Oct 14, 09:05')
  })

  it('formats full date-time', () => {
    expect(formatDateTime('2026-10-14T17:40:00')).toBe('Oct 14, 2026 · 17:40')
  })

  it('uses the given locale', () => {
    expect(formatDate('2026-10-14', 'ru')).toBe('14 окт. 2026 г.')
    expect(formatDate('2026-10-14', 'uz')).toBe('14-okt, 2026')
    expect(formatDateTime('2026-10-14T17:40:00', 'ru')).toBe('14 окт. 2026 г. · 17:40')
  })

  it('formats Uzbek without relying on the runtime CLDR data', () => {
    expect(formatDate('2026-01-09', 'uz')).toBe('9-yan, 2026')
    expect(formatShortDateTime('2026-08-03T07:05:00', 'uz')).toBe('3-avg, 07:05')
    expect(formatDateTime('2026-12-31T23:59:00', 'uz-Latn-UZ')).toBe('31-dek, 2026 · 23:59')
  })
})

describe('getAge', () => {
  const now = new Date('2026-10-14T12:00:00')

  it.each([
    ['2026-10-14T11:59:40', 'now', 0],
    ['2026-10-14T11:15:00', 'minutes', 45],
    ['2026-10-14T10:00:00', 'hours', 2],
    ['2026-10-13T11:00:00', 'days', 1],
    ['2026-10-02T12:00:00', 'days', 12],
  ] as const)('%s → %s %d', (iso, unit, count) => {
    expect(getAge(iso, now)).toEqual({ unit, count })
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
