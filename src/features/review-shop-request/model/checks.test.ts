import { describe, expect, it } from 'vitest'
import { allChecksPassed, approveHint, countCompleted } from './checks'

describe('verification checks', () => {
  it('counts only ticked checks', () => {
    expect(countCompleted()).toBe(0)
    expect(countCompleted({ docs: true, stir: false })).toBe(1)
  })

  it('passes only when every check is ticked', () => {
    expect(allChecksPassed({ docs: true, stir: true })).toBe(false)
    expect(allChecksPassed({ docs: true, stir: true, addr: true })).toBe(true)
  })

  it('describes progress towards approval', () => {
    expect(approveHint({})).toBe('0 of 3 checks done — complete them to approve')
    expect(approveHint({ addr: true })).toBe('1 of 3 checks done — complete them to approve')
    expect(approveHint({ docs: true, stir: true, addr: true })).toBe('All checks passed')
  })
})
