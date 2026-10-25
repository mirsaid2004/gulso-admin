import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

export function SectionLabel({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase', className)} {...props} />
}
