import { useUpdateUserMutation, type User } from '@/entities/user'
import { notify } from '@/shared/ui'

export function useToggleUserBlock() {
  const mutation = useUpdateUserMutation()

  const toggle = (user: User) =>
    mutation.mutate(
      { id: user.id, patch: { blocked: !user.blocked } },
      { onError: (e) => notify('Could not update user', e.message, 'danger') },
    )

  return { toggle, pendingId: mutation.isPending ? mutation.variables?.id : undefined }
}
