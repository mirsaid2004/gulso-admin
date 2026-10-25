import { CircleCheck } from 'lucide-react'
import { toast } from 'sonner'

export type ToastTone = 'success' | 'warning' | 'danger'

const TONE_COLOR: Record<ToastTone, string> = {
  success: 'text-success',
  warning: 'text-amber-500',
  danger: 'text-rose-500',
}

/** Shows the design's toast: a tinted check icon, a bold title and a muted description. */
export function notify(title: string, description: string, tone: ToastTone = 'success') {
  toast.custom(() => (
    <div
      role="status"
      className="flex w-[356px] items-start gap-2.5 rounded-lg border border-border bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    >
      <CircleCheck className={`size-5 shrink-0 ${TONE_COLOR[tone]}`} />
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-bold text-slate-900">{title}</span>
        <span className="text-[13px] text-slate-500">{description}</span>
      </div>
    </div>
  ))
}
