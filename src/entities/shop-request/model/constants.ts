import type { PillTone } from '@/shared/ui'
import type { RequestStatus } from './types'

export const REQUEST_STATUSES: RequestStatus[] = ['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']

export const REQUEST_STATUS_TONE: Record<RequestStatus, PillTone> = {
  PENDING: 'amber',
  CHANGES_REQUESTED: 'rose',
  APPROVED: 'emerald',
  REJECTED: 'slate',
}
