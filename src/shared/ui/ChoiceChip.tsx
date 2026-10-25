import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

type ChoiceChipProps = ComponentProps<'button'> & { selected: boolean }

export function ChoiceChip({ selected, className, type = 'button', ...props }: ChoiceChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'whitespace-nowrap rounded-xl border px-3.5 py-2 text-[13px] font-bold transition-colors',
        selected
          ? 'border-primary bg-primary text-white shadow-[0_1px_3px_0_oklch(0.6067_0.2266_7.24/0.2)]'
          : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-primary/30',
        className,
      )}
      {...props}
    />
  )
}
