import { Check } from 'lucide-react'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { SectionLabel } from '@/shared/ui'
import type { ReviewShopRequestModel } from '../model/useReviewShopRequest'

type Props = Pick<ReviewShopRequestModel, 'checks' | 'toggleCheck'>

export function VerificationChecks({ checks, toggleCheck }: Props) {
  const { t } = useLocale()
  return (
    <div className="mx-8 mb-6 flex flex-col gap-3">
      <SectionLabel>{t('review.checksTitle')}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <button
            key={c.key}
            type="button"
            role="checkbox"
            aria-checked={c.checked}
            onClick={() => toggleCheck(c.key)}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] font-bold transition-colors',
              c.checked ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-600',
            )}
          >
            <span
              className={cn(
                'flex size-4 items-center justify-center rounded-[5px] border text-white',
                c.checked ? 'border-success bg-success' : 'border-slate-300 bg-white',
              )}
            >
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
