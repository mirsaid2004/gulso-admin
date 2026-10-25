import { describe, expect, it } from 'vitest'
import { formatPhoneInput, isPhoneComplete, toInternational } from './phone'

describe('formatPhoneInput', () => {
  it.each([
    ['', ''],
    ['9', '9'],
    ['901', '90 1'],
    ['90123', '90 123'],
    ['9012345', '90 123 45'],
    ['901234567', '90 123 45 67'],
  ])('%s → "%s"', (raw, expected) => {
    expect(formatPhoneInput(raw)).toBe(expected)
  })

  it('drops non-digits and anything past nine digits', () => {
    expect(formatPhoneInput('90-123 (45) 67 89')).toBe('90 123 45 67')
  })

  it('strips the country code from a pasted full number', () => {
    expect(formatPhoneInput('+998 90 000 00 01')).toBe('90 000 00 01')
    expect(formatPhoneInput('998901234567')).toBe('90 123 45 67')
  })

  it('keeps local numbers that happen to start with 998', () => {
    expect(formatPhoneInput('998765432')).toBe('99 876 54 32')
  })
})

describe('isPhoneComplete', () => {
  it('requires all nine digits', () => {
    expect(isPhoneComplete('90 123 45 6')).toBe(false)
    expect(isPhoneComplete('90 123 45 67')).toBe(true)
  })
})

describe('toInternational', () => {
  it('prefixes the country code', () => {
    expect(toInternational('90 123 45 67')).toBe('+998901234567')
  })
})
