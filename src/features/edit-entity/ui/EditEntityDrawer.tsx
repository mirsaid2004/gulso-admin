import { useLocale } from '@/shared/i18n'
import { Button, ChoiceChip, Pill, Sheet, SwitchRow } from '@/shared/ui'
import { cn } from '@/shared/lib'
import { useEditDraft } from '../model/useEditDraft'
import type { Draft, EntityKind, FieldDef } from '../model/types'

interface EditEntityDrawerProps {
  kind: EntityKind
  entityId: number
  fields: FieldDef[]
  original: Draft
  isSaving?: boolean
  onSave: (patch: Draft, label: string) => void
  onClose: () => void
}

/** Mount with `key={entityId}` so the draft resets when another entity is opened. */
export function EditEntityDrawer({ kind, entityId, fields, original, isSaving, onSave, onClose }: EditEntityDrawerProps) {
  const { t } = useLocale()
  const form = useEditDraft(fields, original)
  const title = kind === 'order' ? t('orders.orderNumber', { id: entityId }) : String(form.draft.name || '—')

  return (
    <Sheet
      open
      onOpenChange={(open) => !open && onClose()}
      eyebrow={t('edit.eyebrow', { kind: t(`edit.kind.${kind}`), id: entityId })}
      title={title}
      description={t('edit.description')}
      footer={
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-400">{form.dirtyLabel}</span>
          <div className="flex gap-2">
            <Button variant="ghost" className="px-5" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              className="px-7"
              disabled={!form.dirtyCount || isSaving}
              onClick={() => onSave(form.getPatch(), title)}
            >
              {t('edit.save')}
            </Button>
          </div>
        </div>
      }
    >
      {fields.map((field) => {
        const inputId = `edit-${field.key}`
        const value = form.draft[field.key]
        return (
          <section key={field.key} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={field.type === 'text' || field.type === 'number' ? inputId : undefined}
                id={`${inputId}-label`}
                className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase"
              >
                {field.label}
              </label>
              {form.isDirty(field.key) && (
                <Pill tone="amber" className="px-2 py-0.5 text-[9px] tracking-[0.05em]">
                  {t('edit.edited')}
                </Pill>
              )}
            </div>

            {(field.type === 'text' || field.type === 'number') && (
              <div className="relative">
                <input
                  id={inputId}
                  type={field.type}
                  min={field.type === 'number' ? 0 : undefined}
                  value={String(value ?? '')}
                  onChange={(e) => form.setField(field.key, e.target.value)}
                  className={cn(
                    'h-11 w-full rounded-[14px] border bg-slate-50 pr-14 pl-3 text-sm font-semibold text-slate-900 shadow-xs outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50',
                    form.isDirty(field.key) ? 'border-amber-300' : 'border-slate-100',
                  )}
                />
                {field.type === 'number' && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {field.suffix}
                  </span>
                )}
              </div>
            )}

            {(field.type === 'choice' || field.type === 'multi') && (
              <div role="group" aria-labelledby={`${inputId}-label`} className="flex flex-wrap gap-1.5">
                {field.options.map((opt) => {
                  const selected =
                    field.type === 'multi'
                      ? ((value as Array<string | number>) ?? []).includes(opt.value)
                      : value === opt.value
                  return (
                    <ChoiceChip
                      key={opt.value}
                      selected={selected}
                      onClick={() =>
                        field.type === 'multi'
                          ? form.toggleOption(field.key, opt.value)
                          : form.setField(field.key, opt.value)
                      }
                    >
                      {opt.label}
                    </ChoiceChip>
                  )
                })}
              </div>
            )}

            {field.type === 'toggle' && (
              <SwitchRow
                checked={Boolean(value)}
                onCheckedChange={(checked) => form.setField(field.key, checked)}
                label={field.hint}
              />
            )}
          </section>
        )
      })}
    </Sheet>
  )
}
