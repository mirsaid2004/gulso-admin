import { describe, expect, it } from 'vitest'
import type { User } from '@/entities/user'
import { matchesUserTab } from './userTabs'

type TabSubject = Pick<User, 'roles' | 'blocked'>

describe('matchesUserTab', () => {
  const seller: TabSubject = { roles: ['USER', 'SELLER'], blocked: false }
  const blockedBuyer: TabSubject = { roles: ['USER'], blocked: true }

  it('filters by role', () => {
    expect(matchesUserTab(seller, 'SELLER')).toBe(true)
    expect(matchesUserTab(seller, 'ADMIN')).toBe(false)
  })

  it('filters blocked users regardless of role', () => {
    expect(matchesUserTab(blockedBuyer, 'BLOCKED')).toBe(true)
    expect(matchesUserTab(seller, 'BLOCKED')).toBe(false)
  })

  it('ALL matches everyone', () => {
    expect(matchesUserTab(blockedBuyer, 'ALL')).toBe(true)
  })
})
