import { isCancellable, useUpdateOrderMutation, type Order } from '@/entities/order'
import { notify } from '@/shared/ui'

export function useCancelOrder() {
  const mutation = useUpdateOrderMutation()

  const cancel = (order: Order) => {
    if (!isCancellable(order)) return
    mutation.mutate(
      { id: order.id, patch: { status: 'CANCELLED' } },
      {
        onSuccess: () => notify(`Order #${order.id} cancelled`, 'Customer and shop have been notified.', 'danger'),
        onError: (e) => notify('Could not cancel order', e.message, 'danger'),
      },
    )
  }

  return { cancel, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
