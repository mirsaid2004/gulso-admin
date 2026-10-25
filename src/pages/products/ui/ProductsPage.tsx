import { EditEntityDrawer } from '@/features/edit-entity'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
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

const COLUMN_KEYS = ['product', 'shop', 'price', 'stock', 'rating', 'status'] as const

export function ProductsPage() {
  const { t } = useLocale()
  const vm = useProductsViewModel()
  const columns = [
    ...COLUMN_KEYS.map((key) => ({ key, label: t(`products.columns.${key}`) })),
    { key: 'actions', label: <span className="sr-only">{t('common.actions')}</span> },
  ]

  return (
    <>
      <PageHeader
        title={t('pages.products.title')}
        subtitle={t('pages.products.subtitle')}
        actions={
          <SearchInput
            value={vm.search}
            onValueChange={vm.setSearch}
            placeholder={t('pages.products.searchPlaceholder')}
            aria-label={t('pages.products.searchLabel')}
          />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label={t('products.tabsLabel')} />
        {vm.shopFilterName && (
          <FilterChip label={t('common.shopFilter', { name: vm.shopFilterName })} onClear={vm.clearShopFilter} />
        )}
      </Toolbar>

      <DataTable columns={columns} empty={!vm.isLoading && !vm.rows.length && <EmptyState>{t('products.empty')}</EmptyState>}>
        {vm.rows.map(({ product, shopName, category, price, stock, status, badge, isToggling }) => (
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
              <span className="text-sm font-black text-primary italic">{price}</span>
              {product.discount > 0 && (
                <Pill tone="danger" className="ml-1.5 rounded-md px-1.5 py-0.5 text-[9px]">
                  -{product.discount}%
                </Pill>
              )}
            </Td>
            <Td className="py-3 text-sm font-bold whitespace-nowrap text-slate-600">{stock}</Td>
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
                  {product.hidden ? t('products.unhide') : t('products.hide')}
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
