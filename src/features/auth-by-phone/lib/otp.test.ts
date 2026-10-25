import { describe, expect, it } from 'vitest'
import { emptyOtp, fillOtp, formatCountdown, isOtpComplete } from './otp'

describe('fillOtp', () => {
  it('types one digit and moves focus to the next box', () => {
    expect(fillOtp(emptyOtp(), 0, '4')).toEqual({ otp: ['4', '', '', '', '', ''], focus: 1 })
  })

  it('keeps focus on the last box', () => {
    expect(fillOtp(['1', '2', '3', '4', '5', ''], 5, '6').focus).toBe(5)
  })

  it('replaces the box content when typing over a digit', () => {
    // the input briefly holds "47" when typing 7 over 4; only the new key counts
    expect(fillOtp(['4', '', '', '', '', ''], 0, '7').otp[0]).toBe('7')
  })

  it('spreads a pasted code across the boxes', () => {
    expect(fillOtp(emptyOtp(), 0, '123456')).toEqual({ otp: ['1', '2', '3', '4', '5', '6'], focus: 5 })
  })

  it('spreads a paste from the middle and drops the overflow', () => {
    expect(fillOtp(emptyOtp(), 3, '98765').otp).toEqual(['', '', '', '9', '8', '7'])
  })

  it('ignores non-digits and clears on delete', () => {
    expect(fillOtp(emptyOtp(), 0, 'a').otp[0]).toBe('')
    expect(fillOtp(['5', '', '', '', '', ''], 0, '').otp[0]).toBe('')
  })
})

describe('isOtpComplete', () => {
  it('needs a digit in every box', () => {
    expect(isOtpComplete(['1', '2', '3', '4', '5', ''])).toBe(false)
    expect(isOtpComplete(['1', '2', '3', '4', '5', '6'])).toBe(true)
  })
})

describe('formatCountdown', () => {
  it.each([
    [59, '00:59'],
    [5, '00:05'],
    [75, '01:15'],
    [0, '00:00'],
    [-3, '00:00'],
  ])('%d → %s', (seconds, expected) => {
    expect(formatCountdown(seconds)).toBe(expected)
  })
})
