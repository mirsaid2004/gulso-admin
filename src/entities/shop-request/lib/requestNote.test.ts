import { describe, expect, it } from 'vitest'
import type { ShopRequest } from '../model/types'
import { countByStatus, getRequestNote } from './requestNote'

const request = (patch: Partial<ShopRequest>): ShopRequest => ({
  id: 1,
  name: 'Choco Lab',
  ownerId: 140,
  categories: ['GIFTS'],
  description: '',
  phone: '',
  address: '',
  legalEntity: 'YATT',
  stir: '1',
  status: 'PENDING',
  documents: [],
  submittedAt: '2026-10-12T11:05:00',
  ...patch,
})

describe('getRequestNote', () => {
  it('is null for a fresh pending request', () => {
    expect(getRequestNote(request({}))).toBeNull()
  })

  it('shows the previous note on a resubmitted pending request', () => {
    expect(getRequestNote(request({ previousNote: 'Fix STIR' }))).toEqual({ kind: 'resubmitted', text: 'Fix STIR' })
  })

  it('ignores a stale decision note while pending', () => {
    expect(getRequestNote(request({ note: 'old' }))).toBeNull()
  })

  it.each([
    ['CHANGES_REQUESTED', 'changes'],
    ['REJECTED', 'rejected'],
    ['APPROVED', 'approved'],
  ] as const)('classifies a %s decision note as %s', (status, kind) => {
    expect(getRequestNote(request({ status, note: 'Because' }))).toEqual({ kind, text: 'Because' })
  })

  it('is null for a decision without a note', () => {
    expect(getRequestNote(request({ status: 'REJECTED' }))).toBeNull()
  })
})

describe('countByStatus', () => {
  it('counts requests in one status', () => {
    const list = [request({}), request({ status: 'REJECTED' }), request({})]
    expect(countByStatus(list, 'PENDING')).toBe(2)
    expect(countByStatus(list, 'APPROVED')).toBe(0)
  })
})
