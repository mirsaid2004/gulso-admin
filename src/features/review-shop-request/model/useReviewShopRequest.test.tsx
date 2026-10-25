import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { http } from 'msw'
import { db } from '@/mocks/db'
import { server } from '@/mocks/server'
import { api, fail } from '@/mocks/handlers/utils'
import { renderHookWithProviders } from '@/test/render'
import { useReviewShopRequest } from './useReviewShopRequest'

const pending = () => structuredClone(db.shopRequests.find((r) => r.id === 41)!)
const tulip = () => structuredClone(db.shopRequests.find((r) => r.id === 40)!)

describe('useReviewShopRequest', () => {
  it('blocks approval until every check is ticked', () => {
    const { result } = renderHookWithProviders(() => useReviewShopRequest(pending(), 'Mirsaid'))

    expect(result.current.canApprove).toBe(false)
    act(() => result.current.toggleCheck('docs'))
    act(() => result.current.toggleCheck('stir'))
    expect(result.current.approveHint).toBe('2 of 3 checks done — complete them to approve')
    expect(result.current.canApprove).toBe(false)

    act(() => result.current.toggleCheck('addr'))
    expect(result.current.canApprove).toBe(true)
    expect(result.current.approveHint).toBe('All checks passed')
  })

  it('remembers checks per request', () => {
    let request = pending()
    const { result, rerender } = renderHookWithProviders(() => useReviewShopRequest(request, 'Mirsaid'))

    act(() => result.current.toggleCheck('docs'))
    request = tulip()
    rerender()
    expect(result.current.checks.every((c) => !c.checked)).toBe(true)

    request = pending()
    rerender()
    expect(result.current.checks.find((c) => c.key === 'docs')?.checked).toBe(true)
  })

  it('approves through the API: opens a shop and grants the seller role', async () => {
    db.users.find((u) => u.id === 131)!.roles = ['USER']
    const { result } = renderHookWithProviders(() => useReviewShopRequest(tulip(), 'Kamola Yusupova'))

    act(() => {
      result.current.toggleCheck('docs')
      result.current.toggleCheck('stir')
      result.current.toggleCheck('addr')
    })
    act(() => result.current.approve())

    await waitFor(() => expect(db.shopRequests.find((r) => r.id === 40)?.status).toBe('APPROVED'))
    const opened = db.shops.find((s) => s.name === 'Tulip House')
    expect(opened).toMatchObject({ ownerId: 131, isNew: true, suspended: false })
    expect(db.users.find((u) => u.id === 131)?.roles).toContain('SELLER')
  })

  it('opens the composer, fills a preset and requests changes', async () => {
    const { result } = renderHookWithProviders(() => useReviewShopRequest(pending(), 'Mirsaid'))

    act(() => result.current.openComposer('changes'))
    expect(result.current.composer?.submitLabel).toBe('Send to seller')
    expect(result.current.canSend).toBe(false)

    act(() => result.current.setNoteText(result.current.composer!.presets[1].text))
    expect(result.current.canSend).toBe(true)
    act(() => result.current.send())

    await waitFor(() => expect(result.current.composer).toBeNull())
    expect(db.shopRequests.find((r) => r.id === 41)).toMatchObject({
      status: 'CHANGES_REQUESTED',
      note: "The STIR in the form doesn't match the certificate. Please re-check it.",
    })
  })

  it('does not send a blank note', () => {
    const { result } = renderHookWithProviders(() => useReviewShopRequest(pending(), 'Mirsaid'))

    act(() => result.current.openComposer('reject'))
    act(() => result.current.setNoteText('   '))
    act(() => result.current.send())

    expect(result.current.canSend).toBe(false)
    expect(db.shopRequests.find((r) => r.id === 41)?.status).toBe('PENDING')
  })

  it('keeps the composer open when the API fails', async () => {
    server.use(http.post(api('/admin/shop-requests/:id/reject'), () => fail(500, 'BOOM', 'Server down')))
    const { result } = renderHookWithProviders(() => useReviewShopRequest(pending(), 'Mirsaid'))

    act(() => result.current.openComposer('reject'))
    act(() => result.current.setNoteText('Duplicate'))
    act(() => result.current.send())

    await waitFor(() => expect(result.current.isSending).toBe(false))
    expect(result.current.composer?.mode).toBe('reject')
    expect(db.shopRequests.find((r) => r.id === 41)?.status).toBe('PENDING')
  })
})
