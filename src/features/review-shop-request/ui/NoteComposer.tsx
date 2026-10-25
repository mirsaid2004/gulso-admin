import { useLocale } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import type { ReviewShopRequestModel } from '../model/useReviewShopRequest'

type Props = Pick<ReviewShopRequestModel, 'noteText' | 'setNoteText' | 'closeComposer' | 'send' | 'canSend'> & {
  composer: NonNullable<ReviewShopRequestModel['composer']>
}

export function NoteComposer({ composer, noteText, setNoteText, closeComposer, send, canSend }: Props) {
  const { t } = useLocale()
  const id = `composer-${composer.mode}`
  return (
    <div className="mx-8 mb-6 flex flex-col gap-3 rounded-[20px] bg-slate-50 p-5">
      <label htmlFor={id} className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
        {composer.label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {composer.presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setNoteText(p.text)}
            className="rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-primary/30"
          >
            {p.label}
          </button>
        ))}
      </div>
      <textarea
        id={id}
        rows={3}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder={composer.placeholder}
        className="w-full resize-none rounded-[14px] border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:shadow-[0_0_0_1px_var(--primary)]"
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={closeComposer}>
          {t('common.cancel')}
        </Button>
        <Button variant={composer.submitVariant} size="sm" onClick={send} disabled={!canSend}>
          {composer.submitLabel}
        </Button>
      </div>
    </div>
  )
}
