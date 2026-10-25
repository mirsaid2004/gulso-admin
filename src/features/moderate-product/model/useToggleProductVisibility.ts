import { useUpdateProductMutation, type Product } from '@/entities/product'
import { notify } from '@/shared/ui'

export function useToggleProductVisibility() {
  const mutation = useUpdateProductMutation()

  const toggle = (product: Product) =>
    mutation.mutate(
      { id: product.id, patch: { hidden: !product.hidden } },
      { onError: (e) => notify('Could not update product', e.message, 'danger') },
    )

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
