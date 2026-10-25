import { useUpdateShopMutation, type Shop } from '@/entities/shop'
import { useLocale } from '@/shared/i18n'
import { notify } from '@/shared/ui'

export function useToggleShopSuspension() {
  const { t } = useLocale()
  const mutation = useUpdateShopMutation()

  const toggle = (shop: Shop) => {
    const suspend = !shop.suspended
    mutation.mutate(
      { id: shop.id, patch: { suspended: suspend } },
      {
        onSuccess: () =>
          suspend
            ? notify(t('shops.toast.suspendedTitle', { name: shop.name }), t('shops.toast.suspendedDesc'), 'danger')
            : notify(t('shops.toast.reactivatedTitle', { name: shop.name }), t('shops.toast.reactivatedDesc')),
        onError: (e) => notify(t('shops.toast.failed'), e.message, 'danger'),
      },
    )
  }

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
