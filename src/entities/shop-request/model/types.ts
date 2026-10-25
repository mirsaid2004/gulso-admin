import type { Category } from '@/shared/config'

export type RequestStatus = 'PENDING' | 'CHANGES_REQUESTED' | 'APPROVED' | 'REJECTED'

export type LegalEntity = 'LLC' | 'YATT'

export interface RequestDocument {
  title: string
  fileName: string
  size: string
  url: string
}

export interface ShopRequest {
  id: number
  name: string
  ownerId: number
  categories: Category[]
  description: string
  phone: string
  address: string
  legalEntity: LegalEntity
  /** Taxpayer identification number */
  stir: string
  status: RequestStatus
  documents: RequestDocument[]
  /** ISO local date-time */
  submittedAt: string
  /** Seller resubmitted after a "changes requested" round */
  resubmitted?: boolean
  /** Note from the previous review round, shown while the resubmission is pending */
  previousNote?: string
  /** Note attached to the current decision */
  note?: string
}

export interface ApproveRequestResult {
  request: ShopRequest
  shopId: number
}
