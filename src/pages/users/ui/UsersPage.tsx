import { BlockedTag, RoleTag } from '@/entities/user'
import { EditEntityDrawer } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import {
  DataTable,
  EditButton,
  EmptyState,
  Monogram,
  PageHeader,
  RowActionButton,
  RowActions,
  SearchInput,
  SegmentedTabs,
  Td,
  Toolbar,
  Tr,
} from '@/shared/ui'
import { useUsersViewModel } from '../model/useUsersViewModel'

const COLUMN_KEYS = ['user', 'phone', 'roles', 'shops', 'orders', 'joined'] as const

export function UsersPage() {
  const { t } = useLocale()
  const vm = useUsersViewModel()
  const columns = [
    ...COLUMN_KEYS.map((key) => ({ key, label: t(`users.columns.${key}`) })),
    { key: 'actions', label: <span className="sr-only">{t('common.actions')}</span> },
  ]

  return (
    <>
      <PageHeader
        title={t('pages.users.title')}
        subtitle={t('pages.users.subtitle')}
        actions={
          <SearchInput
            value={vm.search}
            onValueChange={vm.setSearch}
            placeholder={t('pages.users.searchPlaceholder')}
            aria-label={t('pages.users.searchLabel')}
          />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label={t('users.tabsLabel')} />
      </Toolbar>

      <DataTable columns={columns} empty={!vm.isLoading && !vm.rows.length && <EmptyState>{t('users.empty')}</EmptyState>}>
        {vm.rows.map(({ user, joined, shops, orderCount, canBlock, isToggling }) => (
          <Tr key={user.id} className={user.blocked ? 'opacity-60' : undefined}>
            <Td className="py-3.5">
              <div className="flex items-center gap-3">
                <Monogram name={user.name} size="sm" tone="neutral" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-slate-900">{user.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">ID: {user.id}</span>
                </div>
              </div>
            </Td>
            <Td className="py-3.5 text-[13px] font-semibold whitespace-nowrap text-slate-600">{user.phone}</Td>
            <Td className="py-3.5">
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <RoleTag key={role} role={role} />
                ))}
                {user.blocked && <BlockedTag />}
              </div>
            </Td>
            <Td className="py-3.5 text-[13px] font-bold text-slate-600">{shops}</Td>
            <Td className="py-3.5 text-sm font-bold text-slate-600">{orderCount}</Td>
            <Td className="py-3.5 text-[13px] font-medium whitespace-nowrap text-slate-400">{joined}</Td>
            <Td className="py-3.5">
              <RowActions>
                {canBlock && (
                  <RowActionButton
                    tone={user.blocked ? 'positive' : 'neutral'}
                    disabled={isToggling}
                    onClick={() => vm.toggleBlock(user)}
                  >
                    {user.blocked ? t('users.unblock') : t('users.block')}
                  </RowActionButton>
                )}
                <EditButton onClick={() => vm.edit(user)} />
              </RowActions>
            </Td>
          </Tr>
        ))}
      </DataTable>

      {vm.editing && (
        <EditEntityDrawer
          key={vm.editing.id}
          kind="user"
          entityId={vm.editing.id}
          fields={vm.editing.fields}
          original={vm.editing.original}
          isSaving={vm.editor.isSaving}
          onSave={vm.editor.save}
          onClose={vm.editor.close}
        />
      )}
    </>
  )
}
