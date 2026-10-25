import { isCancellable, useUpdateOrderMutation, type Order } from '@/entities/order'
import { useLocale } from '@/shared/i18n'
import { notify } from '@/shared/ui'

export function useCancelOrder() {
  const { t } = useLocale()
  const mutation = useUpdateOrderMutation()

  const cancel = (order: Order) => {
    if (!isCancellable(order)) return
    mutation.mutate(
      { id: order.id, patch: { status: 'CANCELLED' } },
      {
        onSuccess: () =>
          notify(t('orders.toast.cancelledTitle', { id: order.id }), t('orders.toast.cancelledDesc'), 'danger'),
        onError: (e) => notify(t('orders.toast.failed'), e.message, 'danger'),
      },
    )
  }

  return { cancel, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
