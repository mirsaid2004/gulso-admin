import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib'

const pillVariants = cva('inline-flex items-center whitespace-nowrap font-black', {
  variants: {
    tone: {
      amber: 'bg-amber-100 text-amber-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      slate: 'bg-slate-100 text-slate-500',
      rose: 'bg-rose-100 text-rose-700',
      indigo: 'bg-indigo-50 text-indigo-500',
      teal: 'bg-teal-50 text-teal-500',
      primary: 'bg-primary text-white',
      primarySoft: 'bg-primary/10 text-primary',
      success: 'bg-success text-white',
      stockOut: 'bg-stock-out text-white',
      danger: 'bg-rose-500 text-white',
    },
    shape: {
      /** rounded status badge, e.g. UNDER REVIEW */
      round: 'rounded-full px-2.5 py-1 text-[10px] tracking-[0.025em]',
      /** small square-ish tag, e.g. role or delivery type */
      tag: 'rounded-md px-2 py-[3px] text-[9px] tracking-[0.1em]',
    },
  },
  defaultVariants: { tone: 'slate', shape: 'round' },
})

export type PillTone = NonNullable<VariantProps<typeof pillVariants>['tone']>

type PillProps = ComponentProps<'span'> & VariantProps<typeof pillVariants>

export function Pill({ className, tone, shape, ...props }: PillProps) {
  return <span className={cn(pillVariants({ tone, shape }), className)} {...props} />
}
