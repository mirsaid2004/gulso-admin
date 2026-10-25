import { Pill } from '@/shared/ui'
import { ROLE_META } from '../model/constants'
import type { Role } from '../model/types'

export function RoleTag({ role }: { role: Role }) {
  return (
    <Pill shape="tag" tone={ROLE_META[role].tone}>
      {ROLE_META[role].label}
    </Pill>
  )
}

export function BlockedTag() {
  return (
    <Pill shape="tag" tone="rose">
      BLOCKED
    </Pill>
  )
}
