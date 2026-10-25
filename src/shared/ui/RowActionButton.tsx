import type { ComponentProps } from 'react'
import { Pencil } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'

const rowActionVariants = cva(
  'h-9 whitespace-nowrap rounded-xl border-none px-3.5 text-xs font-bold transition-colors disabled:opacity-50',
  {
    variants: {
      tone: {
        neutral: 'bg-slate-50 text-slate-500',
        positive: 'bg-emerald-100 text-emerald-700',
        cancel: 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

type RowActionButtonProps = ComponentProps<'button'> & VariantProps<typeof rowActionVariants>

/** Small text button used in table rows: Suspend / Reactivate, Hide / Unhide, Block / Unblock, Cancel. */
export function RowActionButton({ className, tone, type = 'button', ...props }: RowActionButtonProps) {
  return <button type={type} className={cn(rowActionVariants({ tone }), className)} {...props} />
}

export function EditButton({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  const { t } = useLocale()
  return (
    <button
      type={type}
      title={t('common.edit')}
      aria-label={t('common.edit')}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-xl border-none bg-slate-50 text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary',
        className,
      )}
      {...props}
    >
      <Pencil className="size-3.5" />
    </button>
  )
}
