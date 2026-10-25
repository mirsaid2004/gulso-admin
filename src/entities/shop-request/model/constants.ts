import type { PillTone } from '@/shared/ui'
import type { LegalEntity, RequestStatus } from './types'

export const REQUEST_STATUSES: RequestStatus[] = ['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']

export const REQUEST_STATUS_META: Record<RequestStatus, { badge: string; tab: string; tone: PillTone }> = {
  PENDING: { badge: 'UNDER REVIEW', tab: 'Pending', tone: 'amber' },
  CHANGES_REQUESTED: { badge: 'CHANGES REQUESTED', tab: 'Changes requested', tone: 'rose' },
  APPROVED: { badge: 'APPROVED', tab: 'Approved', tone: 'emerald' },
  REJECTED: { badge: 'REJECTED', tab: 'Rejected', tone: 'slate' },
}

export const LEGAL_ENTITY_LABEL: Record<LegalEntity, string> = {
  LLC: 'LLC (MChJ)',
  YATT: 'Sole proprietor (YaTT)',
}
