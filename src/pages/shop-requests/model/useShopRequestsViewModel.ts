import { useState } from 'react'
import { countByStatus, REQUEST_STATUSES, useShopRequestsQuery, type RequestStatus } from '@/entities/shop-request'
import { findUser, useUsersQuery } from '@/entities/user'
import { shopsOwnedBy, useShopsQuery } from '@/entities/shop'
import { categoryEmoji } from '@/shared/config'
import { useLocale } from '@/shared/i18n'
import { getAge, matchesQuery } from '@/shared/lib'

export function useShopRequestsViewModel() {
  const { t } = useLocale()
  const requestsQuery = useShopRequestsQuery()
  const usersQuery = useUsersQuery()
  const shopsQuery = useShopsQuery()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<RequestStatus>('PENDING')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const requests = requestsQuery.data ?? []
  const users = usersQuery.data ?? []
  const shops = shopsQuery.data ?? []

  const list = requests
    .filter((r) => r.status === tab && matchesQuery(search, r.name, findUser(users, r.ownerId).name))
    .map((r) => {
      const age = getAge(r.submittedAt)
      return {
        request: r,
        ownerName: findUser(users, r.ownerId).name,
        emojis: r.categories.map(categoryEmoji).join(' '),
        age: t(`age.${age.unit}`, { count: age.count }),
      }
    })

  // Falls back to the first visible request, so after a decision the next pending one opens.
  const selected = list.find((item) => item.request.id === selectedId) ?? list[0] ?? null
  const owner = selected ? findUser(users, selected.request.ownerId) : null

  return {
    isLoading: requestsQuery.isLoading || usersQuery.isLoading || shopsQuery.isLoading,
    search,
    setSearch,
    tab,
    tabs: REQUEST_STATUSES.map((s) => ({
      key: s,
      label: t(`requests.status.${s}.tab`),
      count: countByStatus(requests, s),
    })),
    setTab: (next: RequestStatus) => {
      setTab(next)
      setSelectedId(null)
    },
    list,
    selectedId: selected?.request.id ?? null,
    select: setSelectedId,
    selected: selected && owner ? { request: selected.request, owner, ownerShops: shopsOwnedBy(shops, owner.id) } : null,
  }
}
