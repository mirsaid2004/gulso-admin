import { cva, type VariantProps } from 'class-variance-authority'
import { cn, monogram } from '@/shared/lib'

const monogramVariants = cva('flex shrink-0 items-center justify-center font-black', {
  variants: {
    size: {
      sm: 'size-9 rounded-xl text-xs',
      md: 'size-10 rounded-[14px] text-[13px]',
      lg: 'size-11 rounded-[14px] text-sm',
      xl: 'size-14 rounded-[18px] text-lg',
    },
    tone: {
      primary: 'bg-primary/10 text-primary',
      neutral: 'bg-slate-100 text-slate-600',
    },
  },
  defaultVariants: { size: 'md', tone: 'primary' },
})

type MonogramProps = VariantProps<typeof monogramVariants> & { name: string; className?: string }

export function Monogram({ name, size, tone, className }: MonogramProps) {
  return (
    <div aria-hidden className={cn(monogramVariants({ size, tone }), className)}>
      {monogram(name)}
    </div>
  )
}
