import { DELIVERY_META, ORDER_STATUS_META } from '@/entities/order'
import { EditEntityDrawer } from '@/features/edit-entity'
import { PAGE_META } from '@/shared/config'
import { formatUzs } from '@/shared/lib'
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

const meta = PAGE_META.orders

const COLUMNS = [
  { key: 'order', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'shop', label: 'Shop' },
  { key: 'items', label: 'Items' },
  { key: 'total', label: 'Total' },
  { key: 'commission', label: 'Commission' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: <span className="sr-only">Actions</span> },
]

export function OrdersPage() {
  const vm = useOrdersViewModel()

  return (
    <>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <SearchInput value={vm.search} onValueChange={vm.setSearch} placeholder={meta.searchPlaceholder} aria-label="Search orders" />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label="Order status" />
        {vm.shopFilterName && <FilterChip label={`Shop: ${vm.shopFilterName}`} onClear={vm.clearShopFilter} />}
      </Toolbar>

      <DataTable
        columns={COLUMNS}
        minWidth={900}
        empty={!vm.isLoading && !vm.rows.length && <EmptyState>No orders found</EmptyState>}
      >
        {vm.rows.map((row) => {
          const { order } = row
          const status = ORDER_STATUS_META[order.status]
          const delivery = DELIVERY_META[order.deliveryType]
          return (
            <Tr key={order.id}>
              <Td>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-slate-900">Order #{order.id}</span>
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
              <Td className="text-sm font-black whitespace-nowrap text-slate-900">{formatUzs(order.total)}</Td>
              <Td className="text-[13px] font-bold whitespace-nowrap text-slate-400">{row.commission}</Td>
              <Td>
                <div className="flex flex-col items-start gap-1">
                  <Pill tone={status.tone} className="py-[3px]">
                    {status.label}
                  </Pill>
                  <Pill tone={delivery.tone} shape="tag" className="py-0.5">
                    {delivery.label}
                  </Pill>
                </div>
              </Td>
              <Td>
                <RowActions>
                  {row.canCancel && (
                    <RowActionButton tone="cancel" disabled={row.isCancelling} onClick={() => vm.cancel(order)}>
                      Cancel
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
