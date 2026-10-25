import { useUpdateProductMutation, type Product } from '@/entities/product'
import { useLocale } from '@/shared/i18n'
import { notify } from '@/shared/ui'

export function useToggleProductVisibility() {
  const { t } = useLocale()
  const mutation = useUpdateProductMutation()

  const toggle = (product: Product) =>
    mutation.mutate(
      { id: product.id, patch: { hidden: !product.hidden } },
      { onError: (e) => notify(t('products.failed'), e.message, 'danger') },
    )

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
