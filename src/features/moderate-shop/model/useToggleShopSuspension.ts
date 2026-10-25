import { useUpdateShopMutation, type Shop } from '@/entities/shop'
import { notify } from '@/shared/ui'

export function useToggleShopSuspension() {
  const mutation = useUpdateShopMutation()

  const toggle = (shop: Shop) => {
    const suspend = !shop.suspended
    mutation.mutate(
      { id: shop.id, patch: { suspended: suspend } },
      {
        onSuccess: () =>
          suspend
            ? notify(`${shop.name} suspended`, 'Its products are hidden from buyers.', 'danger')
            : notify(`${shop.name} reactivated`, 'Its products are visible again.'),
        onError: (e) => notify('Could not update shop', e.message, 'danger'),
      },
    )
  }

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
