import { SHOP_STATUS_META } from '@/entities/shop'
import { EditEntityDrawer } from '@/features/edit-entity'
import { PAGE_META } from '@/shared/config'
import { formatUzs } from '@/shared/lib'
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

const meta = PAGE_META.shops

const COLUMNS = [
  { key: 'shop', label: 'Shop' },
  { key: 'owner', label: 'Owner' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: <span className="sr-only">Actions</span> },
]

export function ShopsPage() {
  const vm = useShopsViewModel()

  return (
    <>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <SearchInput value={vm.search} onValueChange={vm.setSearch} placeholder={meta.searchPlaceholder} aria-label="Search shops" />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label="Shop status" />
      </Toolbar>

      <DataTable columns={COLUMNS} empty={!vm.isLoading && !vm.rows.length && <EmptyState>No shops found</EmptyState>}>
        {vm.rows.map(({ shop, ownerName, categories, status, stats, isToggling }) => (
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
              <LinkButton onClick={() => vm.viewProducts(shop)} aria-label={`${stats.productCount} products of ${shop.name}`}>
                {stats.productCount}
              </LinkButton>
            </Td>
            <Td>
              <LinkButton onClick={() => vm.viewOrders(shop)} aria-label={`${stats.orderCount} orders of ${shop.name}`}>
                {stats.orderCount}
              </LinkButton>
            </Td>
            <Td className="text-sm font-black whitespace-nowrap text-slate-900">{formatUzs(stats.revenue)}</Td>
            <Td>
              <Pill tone={SHOP_STATUS_META[status].tone}>{SHOP_STATUS_META[status].label}</Pill>
            </Td>
            <Td>
              <RowActions>
                <RowActionButton
                  tone={shop.suspended ? 'positive' : 'neutral'}
                  disabled={isToggling}
                  onClick={() => vm.toggleSuspension(shop)}
                >
                  {shop.suspended ? 'Reactivate' : 'Suspend'}
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
