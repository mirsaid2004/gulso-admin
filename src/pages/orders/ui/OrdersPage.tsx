import { DELIVERY_TONE, ORDER_STATUS_TONE } from '@/entities/order'
import { EditEntityDrawer } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import {
  DataTable,
  EditButton,
  EmptyState,
  FilterChip,
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
import { useOrdersViewModel } from '../model/useOrdersViewModel'

const COLUMN_KEYS = ['order', 'customer', 'shop', 'items', 'total', 'commission', 'status'] as const

export function OrdersPage() {
  const { t } = useLocale()
  const vm = useOrdersViewModel()
  const columns = [
    ...COLUMN_KEYS.map((key) => ({ key, label: t(`orders.columns.${key}`) })),
    { key: 'actions', label: <span className="sr-only">{t('common.actions')}</span> },
  ]

  return (
    <>
      <PageHeader
        title={t('pages.orders.title')}
        subtitle={t('pages.orders.subtitle')}
        actions={
          <SearchInput
            value={vm.search}
            onValueChange={vm.setSearch}
            placeholder={t('pages.orders.searchPlaceholder')}
            aria-label={t('pages.orders.searchLabel')}
          />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label={t('orders.tabsLabel')} />
        {vm.shopFilterName && (
          <FilterChip label={t('common.shopFilter', { name: vm.shopFilterName })} onClear={vm.clearShopFilter} />
        )}
      </Toolbar>

      <DataTable
        columns={columns}
        minWidth={900}
        empty={!vm.isLoading && !vm.rows.length && <EmptyState>{t('orders.empty')}</EmptyState>}
      >
        {vm.rows.map((row) => {
          const { order } = row
          return (
            <Tr key={order.id}>
              <Td>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black whitespace-nowrap text-slate-900">{row.title}</span>
                  <span className="text-[11px] font-medium whitespace-nowrap text-slate-400">{row.date}</span>
                </div>
              </Td>
              <Td>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-slate-900">{row.customerName}</span>
                  <span className="text-[11px] font-medium whitespace-nowrap text-slate-400">{row.customerPhone}</span>
                </div>
              </Td>
              <Td>
                <button
                  type="button"
                  onClick={() => vm.filterByShop(order)}
                  className="border-none bg-transparent p-0 text-left text-sm font-bold whitespace-nowrap text-slate-600 hover:text-primary"
                >
                  {row.shopName}
                </button>
              </Td>
              <Td className="max-w-[220px] text-[13px] font-medium text-slate-600">{order.items}</Td>
              <Td className="text-sm font-black whitespace-nowrap text-slate-900">{row.total}</Td>
              <Td className="text-[13px] font-bold whitespace-nowrap text-slate-400">{row.commission}</Td>
              <Td>
                <div className="flex flex-col items-start gap-1">
                  <Pill tone={ORDER_STATUS_TONE[order.status]} className="py-[3px]">
                    {row.statusLabel}
                  </Pill>
                  <Pill tone={DELIVERY_TONE[order.deliveryType]} shape="tag" className="py-0.5">
                    {row.deliveryLabel}
                  </Pill>
                </div>
              </Td>
              <Td>
                <RowActions>
                  {row.canCancel && (
                    <RowActionButton tone="cancel" disabled={row.isCancelling} onClick={() => vm.cancel(order)}>
                      {t('orders.cancel')}
                    </RowActionButton>
                  )}
                  <EditButton onClick={() => vm.edit(order)} />
                </RowActions>
              </Td>
            </Tr>
          )
        })}
      </DataTable>

      {vm.editing && (
        <EditEntityDrawer
          key={vm.editing.id}
          kind="order"
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
