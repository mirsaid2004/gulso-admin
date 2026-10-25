import { describe, expect, it } from 'vitest'
import { allChecksPassed, countCompleted, VERIFICATION_CHECKS } from './checks'

describe('verification checks', () => {
  it('has three checks', () => {
    expect(VERIFICATION_CHECKS).toEqual(['docs', 'stir', 'addr'])
  })

  it('counts only ticked checks', () => {
    expect(countCompleted()).toBe(0)
    expect(countCompleted({ docs: true, stir: false })).toBe(1)
  })

  it('passes only when every check is ticked', () => {
    expect(allChecksPassed({ docs: true, stir: true })).toBe(false)
    expect(allChecksPassed({ docs: true, stir: true, addr: true })).toBe(true)
  })
})
