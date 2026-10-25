import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

interface FilterChipProps {
  label: string
  onClear: () => void
}

/** Removable chip showing an active filter, e.g. "Shop: Flora Art ×". */
export function FilterChip({ label, onClear }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Clear filter ${label}`}
      className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl border border-primary/10 bg-primary/5 pr-2.5 pl-3.5 text-xs font-bold text-primary"
    >
      {label}
      <X className="size-3.5" />
    </button>
  )
}
