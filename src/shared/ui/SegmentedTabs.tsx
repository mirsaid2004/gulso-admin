import { cn } from '@/shared/lib'

export interface SegmentedTab<K extends string> {
  key: K
  label: string
  count: number
}

interface SegmentedTabsProps<K extends string> {
  tabs: SegmentedTab<K>[]
  value: K
  onChange: (key: K) => void
  label?: string
}

export function SegmentedTabs<K extends string>({ tabs, value, onChange, label = 'Filter' }: SegmentedTabsProps<K>) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap items-center gap-1 rounded-[14px] bg-slate-50 p-1">
      {tabs.map((tab) => {
        const active = tab.key === value
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex h-9 items-center gap-1.5 whitespace-nowrap rounded-[10px] px-4 text-[11px] font-bold uppercase tracking-[0.025em] transition-colors',
              active ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600',
            )}
          >
            {tab.label}{' '}
            <span className="text-[10px] font-black opacity-70">{tab.count}</span>
          </button>
        )
      })}
    </div>
  )
}
