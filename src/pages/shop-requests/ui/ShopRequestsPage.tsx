import { RequestListItem } from '@/entities/shop-request'
import { ShopRequestDetails } from '@/widgets/shop-request-details'
import { useLocale } from '@/shared/i18n'
import { PageHeader, SearchInput, SegmentedTabs, Toolbar } from '@/shared/ui'
import { useShopRequestsViewModel } from '../model/useShopRequestsViewModel'

export function ShopRequestsPage() {
  const { t } = useLocale()
  const vm = useShopRequestsViewModel()

  return (
    <>
      <PageHeader
        title={t('pages.requests.title')}
        subtitle={t('pages.requests.subtitle')}
        actions={
          <SearchInput
            value={vm.search}
            onValueChange={vm.setSearch}
            placeholder={t('pages.requests.searchPlaceholder')}
            aria-label={t('pages.requests.searchLabel')}
          />
        }
      />
      <Toolbar>
        <SegmentedTabs tabs={vm.tabs} value={vm.tab} onChange={vm.setTab} label={t('requests.tabsLabel')} />
      </Toolbar>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex max-w-[340px] min-w-0 flex-[1_1_260px] flex-col gap-2">
          {!vm.isLoading && !vm.list.length && (
            <div className="rounded-3xl bg-white px-4 py-12 text-center text-sm font-bold text-slate-400">
              {t('requests.empty')}
            </div>
          )}
          {vm.list.map((item) => (
            <RequestListItem
              key={item.request.id}
              name={item.request.name}
              ownerName={item.ownerName}
              emojis={item.emojis}
              age={item.age}
              resubmitted={!!item.request.resubmitted}
              selected={item.request.id === vm.selectedId}
              onSelect={() => vm.select(item.request.id)}
            />
          ))}
        </div>
        {vm.selected && (
          <ShopRequestDetails
            request={vm.selected.request}
            owner={vm.selected.owner}
            ownerShops={vm.selected.ownerShops}
          />
        )}
      </div>
    </>
  )
}
