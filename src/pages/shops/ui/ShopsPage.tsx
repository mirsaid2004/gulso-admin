import { SHOP_STATUS_TONE } from '@/entities/shop'
import { EditEntityDrawer } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import {
  DataTable,
  EditButton,
  EmptyState,
  LinkButton,
  Monogram,
  PageHeader,
  Pill,
  RowActionButton,
  RowActions,
  SearchInput,
  SegmentedTabs,
  Td,
  Toolbar,
  Tr,
} from '@/shared/ui'
import { useShopsViewModel } from '../model/useShopsViewModel'

const COLUMN_KEYS = ['shop', 'owner', 'products', 'orders', 'revenue', 'status'] as const

export function ShopsPage() {
  const { t } = useLocale()
  const vm = useShopsViewModel()
  const columns = [
    ...COLUMN_KEYS.map((key) => ({ key, label: t(`shops.columns.${key}`) })),
    { key: 'actions', label: <span className="sr-only">{t('common.actions')}</span> },
  ]

  return (
    <>
      <PageHeader
        title={t('pages.shops.title')}
        subtitle={t('pages.shops.subtitle')}
        actions={
          <SearchInput
            value={vm.search}
            onValueChange={vm.setSearch}
            placeholder={t('pages.shops.searchPlaceholder')}
            aria-label={t('pages.shops.searchLabel')}
          />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label={t('shops.tabsLabel')} />
      </Toolbar>

      <DataTable columns={columns} empty={!vm.isLoading && !vm.rows.length && <EmptyState>{t('shops.empty')}</EmptyState>}>
        {vm.rows.map(({ shop, ownerName, categories, status, stats, revenue, isToggling }) => (
          <Tr key={shop.id} className={shop.suspended ? 'opacity-60' : undefined}>
            <Td>
              <div className="flex items-center gap-3">
                <Monogram name={shop.name} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-slate-900">{shop.name}</span>
                  <span className="text-[10px] font-bold tracking-tight text-slate-400 uppercase">
                    ID: {shop.id} · {categories}
                  </span>
                </div>
              </div>
            </Td>
            <Td className="text-sm font-bold text-slate-600">{ownerName}</Td>
            <Td>
              <LinkButton
                onClick={() => vm.viewProducts(shop)}
                aria-label={t('shops.productsOf', { count: stats.productCount, name: shop.name })}
              >
                {stats.productCount}
              </LinkButton>
            </Td>
            <Td>
              <LinkButton
                onClick={() => vm.viewOrders(shop)}
                aria-label={t('shops.ordersOf', { count: stats.orderCount, name: shop.name })}
              >
                {stats.orderCount}
              </LinkButton>
            </Td>
            <Td className="text-sm font-black whitespace-nowrap text-slate-900">{revenue}</Td>
            <Td>
              <Pill tone={SHOP_STATUS_TONE[status]}>{t(`shops.status.${status}`)}</Pill>
            </Td>
            <Td>
              <RowActions>
                <RowActionButton
                  tone={shop.suspended ? 'positive' : 'neutral'}
                  disabled={isToggling}
                  onClick={() => vm.toggleSuspension(shop)}
                >
                  {shop.suspended ? t('shops.reactivate') : t('shops.suspend')}
                </RowActionButton>
                <EditButton onClick={() => vm.edit(shop)} />
              </RowActions>
            </Td>
          </Tr>
        ))}
      </DataTable>

      {vm.editing && (
        <EditEntityDrawer
          key={vm.editing.id}
          kind="shop"
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
