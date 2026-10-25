import type { ComponentProps } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/shared/lib'

type SearchInputProps = Omit<ComponentProps<'input'>, 'onChange'> & {
  value: string
  onValueChange: (value: string) => void
}

export function SearchInput({ value, onValueChange, className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          'h-11 w-[280px] max-w-full rounded-[14px] border-none bg-slate-100 pr-3 pl-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        {...props}
      />
    </div>
  )
}
