import type { PillTone } from '@/shared/ui'

interface OwnerTag {
  label: string
  tone: Extract<PillTone, 'rose' | 'emerald' | 'slate'>
}

/** Context about the applicant shown under their name: blocked, existing seller, or first shop. */
export function getOwnerTag(owner: { blocked: boolean }, ownedShopNames: string[]): OwnerTag {
  if (owner.blocked) return { label: 'Blocked user', tone: 'rose' }
  const n = ownedShopNames.length
  if (n) {
    return { label: `Existing seller · ${n} shop${n > 1 ? 's' : ''}: ${ownedShopNames.join(', ')}`, tone: 'emerald' }
  }
  return { label: 'First shop · new seller', tone: 'slate' }
}
