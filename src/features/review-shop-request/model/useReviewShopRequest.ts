import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shopRequestApi, shopRequestKeys, type ShopRequest } from '@/entities/shop-request'
import { shopKeys } from '@/entities/shop'
import { userKeys } from '@/entities/user'
import { notify } from '@/shared/ui'
import { allChecksPassed, approveHint, VERIFICATION_CHECKS, type CheckKey, type CheckState } from './checks'
import { COMPOSER_CONFIG, type ComposerMode } from './composer'

interface ComposerState {
  requestId: number
  mode: ComposerMode
  text: string
}

/**
 * View-model for reviewing one shop request. Checks are remembered per request,
 * so switching between requests in the list keeps each one's progress.
 */
export function useReviewShopRequest(request: ShopRequest | null, ownerName: string) {
  const queryClient = useQueryClient()
  const [checks, setChecks] = useState<Record<number, CheckState>>({})
  const [composer, setComposer] = useState<ComposerState | null>(null)

  const requestId = request?.id ?? -1
  const current = checks[requestId] ?? {}
  const activeComposer = composer?.requestId === requestId ? composer : null

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: shopRequestKeys.all }),
      queryClient.invalidateQueries({ queryKey: shopKeys.all }),
      queryClient.invalidateQueries({ queryKey: userKeys.all }),
    ])

  const approveMutation = useMutation({
    mutationFn: (r: ShopRequest) => shopRequestApi.approve(r.id),
    onSuccess: async (_res, r) => {
      await invalidate()
      notify(`${r.name} approved`, `It now opens in ${ownerName}'s seller account.`)
    },
    onError: (e) => notify('Could not approve', e.message, 'danger'),
  })

  const decisionMutation = useMutation({
    mutationFn: ({ r, mode, note }: { r: ShopRequest; mode: ComposerMode; note: string }) =>
      mode === 'changes' ? shopRequestApi.requestChanges(r.id, note) : shopRequestApi.reject(r.id, note),
    onSuccess: async (_res, { r, mode }) => {
      setComposer(null)
      await invalidate()
      if (mode === 'changes') notify('Changes requested', `${ownerName} will see your note.`, 'warning')
      else notify(`${r.name} rejected`, 'The applicant has been notified.', 'danger')
    },
    onError: (e) => notify('Could not send', e.message, 'danger'),
  })

  const canApprove = allChecksPassed(current) && !approveMutation.isPending
  const noteText = activeComposer?.text ?? ''

  return {
    checks: VERIFICATION_CHECKS.map((c) => ({ ...c, checked: !!current[c.key] })),
    toggleCheck: (key: CheckKey) =>
      setChecks((prev) => ({ ...prev, [requestId]: { ...prev[requestId], [key]: !prev[requestId]?.[key] } })),
    approveHint: approveHint(current),
    canApprove,
    isApproving: approveMutation.isPending,
    approve: () => {
      if (request && canApprove) approveMutation.mutate(request)
    },

    composer: activeComposer ? { mode: activeComposer.mode, ...COMPOSER_CONFIG[activeComposer.mode] } : null,
    openComposer: (mode: ComposerMode) => setComposer({ requestId, mode, text: '' }),
    closeComposer: () => setComposer(null),
    noteText,
    setNoteText: (text: string) => setComposer((prev) => (prev ? { ...prev, text } : prev)),
    canSend: noteText.trim().length > 0 && !decisionMutation.isPending,
    isSending: decisionMutation.isPending,
    send: () => {
      const note = noteText.trim()
      if (!request || !activeComposer || !note) return
      decisionMutation.mutate({ r: request, mode: activeComposer.mode, note })
    },
  }
}

export type ReviewShopRequestModel = ReturnType<typeof useReviewShopRequest>
