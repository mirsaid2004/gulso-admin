import { useState } from 'react'
import { useUpdateShopMutation } from '@/entities/shop'
import { useUpdateProductMutation } from '@/entities/product'
import { useUpdateOrderMutation } from '@/entities/order'
import { useUpdateUserMutation } from '@/entities/user'
import { notify } from '@/shared/ui'
import type { Draft, EntityKind } from './types'

export interface EditTarget {
  kind: EntityKind
  id: number
}

const SUCCESS_DESCRIPTION: Record<EntityKind, string> = {
  shop: 'The seller has been notified of the edit.',
  product: 'The seller has been notified of the edit.',
  order: 'The seller has been notified of the edit.',
  user: 'The user will see the changes on next login.',
}

/** Page-level state for which entity is open in the edit drawer, and saving it. */
export function useEntityEditor() {
  const [target, setTarget] = useState<EditTarget | null>(null)
  const shop = useUpdateShopMutation()
  const product = useUpdateProductMutation()
  const order = useUpdateOrderMutation()
  const user = useUpdateUserMutation()

  const mutations = { shop, product, order, user }

  /** `label` names the entity in the toast, e.g. "Flora Art" or "Order #12" (after the edit). */
  const save = (patch: Draft, label: string) => {
    if (!target) return
    const close = () => {
      setTarget(null)
      notify(`${label} updated`, SUCCESS_DESCRIPTION[target.kind])
    }
    if (!Object.keys(patch).length) return setTarget(null)
    // Each mutation takes its own entity's patch type; the drawer's schema guarantees the keys match.
    const mutation = mutations[target.kind] as unknown as {
      mutate: (vars: { id: number; patch: Draft }, opts: { onSuccess: () => void; onError: (e: Error) => void }) => void
    }
    mutation.mutate(
      { id: target.id, patch },
      { onSuccess: close, onError: (e) => notify('Could not save changes', e.message, 'danger') },
    )
  }

  return {
    target,
    open: (t: EditTarget) => setTarget(t),
    close: () => setTarget(null),
    save,
    isSaving: target ? mutations[target.kind].isPending : false,
  }
}

export type EntityEditor = ReturnType<typeof useEntityEditor>
