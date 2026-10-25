import { useUpdateUserMutation, type User } from '@/entities/user'
import { useLocale } from '@/shared/i18n'
import { notify } from '@/shared/ui'

export function useToggleUserBlock() {
  const { t } = useLocale()
  const mutation = useUpdateUserMutation()

  const toggle = (user: User) =>
    mutation.mutate(
      { id: user.id, patch: { blocked: !user.blocked } },
      { onError: (e) => notify(t('users.failed'), e.message, 'danger') },
    )

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
