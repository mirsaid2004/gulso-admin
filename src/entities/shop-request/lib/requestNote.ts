import type { ShopRequest } from '../model/types'

export type RequestNoteKind = 'resubmitted' | 'changes' | 'rejected' | 'approved'

export interface RequestNote {
  kind: RequestNoteKind
  label: string
  text: string
}

const LABELS: Record<RequestNoteKind, string> = {
  resubmitted: 'Previous note — seller resubmitted',
  changes: 'Note sent to seller',
  rejected: 'Rejection reason',
  approved: 'Decision',
}

/** The note box to show on a request, if any: previous-round note while pending, otherwise the decision note. */
export function getRequestNote(request: ShopRequest): RequestNote | null {
  if (request.status === 'PENDING') {
    return request.previousNote
      ? { kind: 'resubmitted', label: LABELS.resubmitted, text: request.previousNote }
      : null
  }
  if (!request.note) return null
  const kind: RequestNoteKind =
    request.status === 'CHANGES_REQUESTED' ? 'changes' : request.status === 'REJECTED' ? 'rejected' : 'approved'
  return { kind, label: LABELS[kind], text: request.note }
}

export function countByStatus(requests: ShopRequest[], status: ShopRequest['status']): number {
  return requests.filter((r) => r.status === status).length
}
