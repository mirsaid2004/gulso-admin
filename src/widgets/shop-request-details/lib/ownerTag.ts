import type { PillTone } from '@/shared/ui'

export interface OwnerTag {
  /** Also the `requests.ownerTag.*` translation key */
  kind: 'blocked' | 'existing' | 'first'
  tone: Extract<PillTone, 'rose' | 'emerald' | 'slate'>
}

/** Context about the applicant shown under their name: blocked, existing seller, or first shop. */
export function getOwnerTag(owner: { blocked: boolean }, ownedShopCount: number): OwnerTag {
  if (owner.blocked) return { kind: 'blocked', tone: 'rose' }
  if (ownedShopCount > 0) return { kind: 'existing', tone: 'emerald' }
  return { kind: 'first', tone: 'slate' }
}
