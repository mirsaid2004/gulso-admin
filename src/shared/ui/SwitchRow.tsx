import { cn } from '@/shared/lib'

interface SwitchRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

/** Full-width toggle row. "On" is styled as a warning (red) since every toggle here restricts something. */
export function SwitchRow({ checked, onCheckedChange, label }: SwitchRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="flex items-center gap-3 rounded-[14px] border border-slate-100 bg-white px-3.5 py-3 text-left"
    >
      <span
        className={cn(
          'flex h-[22px] w-10 shrink-0 rounded-full p-0.5 transition-colors',
          checked ? 'justify-end bg-rose-500' : 'justify-start bg-slate-200',
        )}
      >
        <span className="size-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
      </span>
      <span className="text-[13px] font-semibold text-slate-600">{label}</span>
    </button>
  )
}
