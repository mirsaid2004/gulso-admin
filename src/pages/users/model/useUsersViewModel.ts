import { useState } from 'react'
import { isMaintainer, useUsersQuery, type User } from '@/entities/user'
import { shopsOwnedBy, useShopsQuery } from '@/entities/shop'
import { useOrdersQuery } from '@/entities/order'
import { useToggleUserBlock } from '@/features/moderate-user'
import { toDraft, useEntityEditor, userFields } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import { formatDate, matchesQuery } from '@/shared/lib'
import { matchesUserTab, USER_TABS, type UserTab } from './userTabs'

export function useUsersViewModel() {
  const { t, language } = useLocale()
  const usersQuery = useUsersQuery()
  const shopsQuery = useShopsQuery()
  const ordersQuery = useOrdersQuery()
  const blocking = useToggleUserBlock()
  const editor = useEntityEditor()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<UserTab>('ALL')

  const users = usersQuery.data ?? []
  const shops = shopsQuery.data ?? []
  const orders = ordersQuery.data ?? []

  const rows = users
    .filter((u) => matchesUserTab(u, tab) && matchesQuery(search, u.name, u.phone))
    .map((user) => {
      const owned = shopsOwnedBy(shops, user.id)
      return {
        user,
        joined: formatDate(user.joinedAt, language),
        shops: owned.length ? owned.map((s) => s.name).join(', ') : '—',
        orderCount: orders.filter((o) => o.userId === user.id).length,
        // Maintainers can't be blocked from the panel.
        canBlock: !isMaintainer(user),
        isToggling: blocking.pendingId === user.id,
      }
    })

  const editing = editor.target && users.find((u) => u.id === editor.target!.id)

  return {
    isLoading: usersQuery.isLoading,
    search,
    setSearch,
    tab,
    setTab,
    tabs: USER_TABS.map((key) => ({
      key,
      label: t(`users.tabs.${key}`),
      count: users.filter((u) => matchesUserTab(u, key)).length,
    })),
    rows,
    toggleBlock: blocking.toggle,
    edit: (user: User) => editor.open({ kind: 'user', id: user.id }),
    editor,
    editing: editing ? { id: editing.id, original: toDraft(editing), fields: userFields(t) } : null,
  }
}
