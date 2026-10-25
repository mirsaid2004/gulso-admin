import { useLocale } from '@/shared/i18n'
import { Pill } from '@/shared/ui'
import { ROLE_TONE } from '../model/constants'
import type { Role } from '../model/types'

export function RoleTag({ role }: { role: Role }) {
  const { t } = useLocale()
  return (
    <Pill shape="tag" tone={ROLE_TONE[role]}>
      {t(`users.roles.${role}.tag`)}
    </Pill>
  )
}

export function BlockedTag() {
  const { t } = useLocale()
  return (
    <Pill shape="tag" tone="rose">
      {t('users.blockedTag')}
    </Pill>
  )
}
