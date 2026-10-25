import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary font-black italic text-white shadow-[0_1px_3px_0_oklch(0.6067_0.2266_7.24/0.2),0_4px_6px_-1px_oklch(0.6067_0.2266_7.24/0.2)]',
        dark: 'bg-slate-600 font-black italic text-white',
        danger: 'bg-rose-500 font-black italic text-white',
        soft: 'bg-slate-50 font-bold text-slate-600 hover:bg-slate-100',
        ghost: 'bg-transparent font-bold text-slate-500 hover:bg-accent',
        dangerGhost: 'bg-transparent font-bold text-rose-500 hover:bg-rose-50',
      },
      size: {
        md: 'h-11 rounded-[14px] px-[18px] text-sm',
        sm: 'h-10 rounded-xl px-5 text-[13px]',
      },
    },
    defaultVariants: { variant: 'soft', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
