import { EditEntityDrawer } from '@/features/edit-entity'
import { PAGE_META } from '@/shared/config'
import { cn, formatUzs } from '@/shared/lib'
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
import { useProductsViewModel } from '../model/useProductsViewModel'

const meta = PAGE_META.products

const COLUMNS = [
  { key: 'product', label: 'Product' },
  { key: 'shop', label: 'Shop' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'rating', label: 'Rating' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: <span className="sr-only">Actions</span> },
]

export function ProductsPage() {
  const vm = useProductsViewModel()

  return (
    <>
      <PageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actions={
          <SearchInput value={vm.search} onValueChange={vm.setSearch} placeholder={meta.searchPlaceholder} aria-label="Search products" />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label="Product status" />
        {vm.shopFilterName && <FilterChip label={`Shop: ${vm.shopFilterName}`} onClear={vm.clearShopFilter} />}
      </Toolbar>

      <DataTable columns={COLUMNS} empty={!vm.isLoading && !vm.rows.length && <EmptyState>No results</EmptyState>}>
        {vm.rows.map(({ product, shopName, category, price, status, badge, isToggling }) => (
          <Tr key={product.id}>
            <Td className="py-3">
              <div className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-[14px] bg-slate-50 shadow-xs">
                  <img
                    src={product.imageUrl}
                    alt=""
                    loading="lazy"
                    className={cn('size-full object-cover', status !== 'ACTIVE' && 'grayscale')}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-slate-800">{product.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    ID: {product.id} · {category}
                  </span>
                </div>
              </div>
            </Td>
            <Td className="py-3">
              <button
                type="button"
                onClick={() => vm.filterByShop(product)}
                className="border-none bg-transparent p-0 text-left text-sm font-bold whitespace-nowrap text-slate-600 hover:text-primary"
              >
                {shopName}
              </button>
            </Td>
            <Td className="py-3 whitespace-nowrap">
              <span className="text-sm font-black text-primary italic">{formatUzs(price)}</span>
              {product.discount > 0 && (
                <Pill tone="danger" className="ml-1.5 rounded-md px-1.5 py-0.5 text-[9px]">
                  -{product.discount}%
                </Pill>
              )}
            </Td>
            <Td className="py-3 text-sm font-bold whitespace-nowrap text-slate-600">{product.stock} pcs</Td>
            <Td className="py-3 text-sm font-bold whitespace-nowrap text-slate-600">
              ★ {product.rating} <span className="font-medium text-slate-400">({product.reviewCount})</span>
            </Td>
            <Td className="py-3">
              <Pill tone={badge.tone} className="rounded-lg text-[9px] tracking-widest">
                {badge.label}
              </Pill>
            </Td>
            <Td className="py-3">
              <RowActions>
                <RowActionButton
                  tone={product.hidden ? 'positive' : 'neutral'}
                  disabled={isToggling}
                  onClick={() => vm.toggleVisibility(product)}
                >
                  {product.hidden ? 'Unhide' : 'Hide'}
                </RowActionButton>
                <EditButton onClick={() => vm.edit(product)} />
              </RowActions>
            </Td>
          </Tr>
        ))}
      </DataTable>

      {vm.editing && (
        <EditEntityDrawer
          key={vm.editing.id}
          kind="product"
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
