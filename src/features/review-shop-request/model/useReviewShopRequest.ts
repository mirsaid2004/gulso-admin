import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shopRequestApi, shopRequestKeys, type ShopRequest } from '@/entities/shop-request'
import { shopKeys } from '@/entities/shop'
import { userKeys } from '@/entities/user'
import { useLocale } from '@/shared/i18n'
import { notify } from '@/shared/ui'
import { allChecksPassed, countCompleted, VERIFICATION_CHECKS, type CheckKey, type CheckState } from './checks'
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
  const { t } = useLocale()
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
      notify(t('review.toast.approvedTitle', { name: r.name }), t('review.toast.approvedDesc', { owner: ownerName }))
    },
    onError: (e) => notify(t('review.toast.approveFailed'), e.message, 'danger'),
  })

  const decisionMutation = useMutation({
    mutationFn: ({ r, mode, note }: { r: ShopRequest; mode: ComposerMode; note: string }) =>
      mode === 'changes' ? shopRequestApi.requestChanges(r.id, note) : shopRequestApi.reject(r.id, note),
    onSuccess: async (_res, { r, mode }) => {
      setComposer(null)
      await invalidate()
      if (mode === 'changes') {
        notify(t('review.toast.changesTitle'), t('review.toast.changesDesc', { owner: ownerName }), 'warning')
      } else {
        notify(t('review.toast.rejectedTitle', { name: r.name }), t('review.toast.rejectedDesc'), 'danger')
      }
    },
    onError: (e) => notify(t('review.toast.sendFailed'), e.message, 'danger'),
  })

  const done = countCompleted(current)
  const allDone = allChecksPassed(current)
  const canApprove = allDone && !approveMutation.isPending
  const noteText = activeComposer?.text ?? ''

  const composerView = (mode: ComposerMode) => ({
    mode,
    label: t(`review.composer.${mode}.label`),
    placeholder: t(`review.composer.${mode}.placeholder`),
    submitLabel: t(`review.composer.${mode}.submit`),
    submitVariant: COMPOSER_CONFIG[mode].submitVariant,
    presets: Object.entries(
      t(`review.composer.${mode}.presets`, { returnObjects: true }) as Record<string, { label: string; text: string }>,
    ).map(([id, preset]) => ({ id, ...preset })),
  })

  return {
    checks: VERIFICATION_CHECKS.map((key) => ({ key, label: t(`review.checks.${key}`), checked: !!current[key] })),
    toggleCheck: (key: CheckKey) =>
      setChecks((prev) => ({ ...prev, [requestId]: { ...prev[requestId], [key]: !prev[requestId]?.[key] } })),
    approveHint: allDone
      ? t('review.hintDone')
      : t('review.hintProgress', { done, total: VERIFICATION_CHECKS.length }),
    canApprove,
    isApproving: approveMutation.isPending,
    approve: () => {
      if (request && canApprove) approveMutation.mutate(request)
    },

    composer: activeComposer ? composerView(activeComposer.mode) : null,
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
