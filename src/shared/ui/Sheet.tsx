import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useLocale } from '@/shared/i18n'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

/** Right-side panel on a dimmed backdrop (Radix Dialog), styled after the design's edit drawer. */
export function Sheet({ open, onOpenChange, title, eyebrow, description, footer, children }: SheetProps) {
  const { t } = useLocale()
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/50" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-61 flex w-[460px] max-w-full animate-pop flex-col rounded-l-[32px] bg-background shadow-[0_1px_3px_0_hsl(0_0%_0%/0.25),-12px_0_48px_-12px_hsl(0_0%_0%/0.25)] outline-none">
          <Dialog.Close
            aria-label={t('common.close')}
            className="absolute top-4 right-4 flex size-6 items-center justify-center border-none bg-transparent text-foreground opacity-70 hover:opacity-100"
          >
            <X className="size-4" />
          </Dialog.Close>
          <div className="flex flex-col gap-1.5 border-b border-slate-50 px-8 pt-8 pb-5">
            {eyebrow && (
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{eyebrow}</span>
            )}
            <Dialog.Title className="m-0 text-2xl leading-tight font-black tracking-tight text-slate-900">
              {title}
            </Dialog.Title>
            <Dialog.Description className={description ? 'm-0 text-[13px] font-medium text-slate-400' : 'sr-only'}>
              {description ?? title}
            </Dialog.Description>
          </div>
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">{children}</div>
          {footer && <div className="border-t border-slate-50 px-8 py-5">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
