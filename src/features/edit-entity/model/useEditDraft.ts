import { useState } from 'react'
import { useLocale } from '@/shared/i18n'
import { buildPatch, dirtyKeys, toggleInList } from './draft'
import type { Draft, FieldDef, FieldValue } from './types'

/** Local form state for the edit drawer: a draft copy of the entity plus change tracking. */
export function useEditDraft(fields: FieldDef[], original: Draft) {
  const { t } = useLocale()
  const [draft, setDraft] = useState<Draft>(() => structuredClone(original))

  const dirty = new Set(dirtyKeys(fields, draft, original))

  return {
    draft,
    setField: (key: string, value: FieldValue) => setDraft((d) => ({ ...d, [key]: value })),
    toggleOption: (key: string, value: string | number) =>
      setDraft((d) => ({ ...d, [key]: toggleInList((d[key] as Array<string | number>) ?? [], value) })),
    isDirty: (key: string) => dirty.has(key),
    dirtyCount: dirty.size,
    dirtyLabel: dirty.size ? t('edit.changes', { count: dirty.size }) : t('edit.noChanges'),
    getPatch: () => buildPatch(fields, draft, original),
  }
}
