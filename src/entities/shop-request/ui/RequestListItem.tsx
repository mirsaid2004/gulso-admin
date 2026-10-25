import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Monogram, Pill } from '@/shared/ui'

interface RequestListItemProps {
  name: string
  ownerName: string
  emojis: string
  age: string
  resubmitted: boolean
  selected: boolean
  onSelect: () => void
}

export function RequestListItem({ name, ownerName, emojis, age, resubmitted, selected, onSelect }: RequestListItemProps) {
  const { t } = useLocale()
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected || undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-[20px] border-none p-3.5 text-left transition-colors',
        selected ? 'bg-white shadow-[var(--shadow-sm),0_0_0_1px_oklch(0.6067_0.2266_7.24/0.15)]' : 'bg-transparent hover:bg-white/60',
      )}
    >
      <Monogram name={name} size="lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-black text-slate-900">{name}</span>
          <span className="text-[10px] font-bold whitespace-nowrap text-slate-400">{age}</span>
        </div>
        <span className="truncate text-xs font-medium text-slate-500">
          {ownerName} · {emojis}
        </span>
        {resubmitted && (
          <Pill tone="blue" className="mt-0.5 self-start px-2 py-0.5 text-[9px] tracking-[0.05em]">
            {t('requests.resubmitted')}
          </Pill>
        )}
      </div>
    </button>
  )
}
