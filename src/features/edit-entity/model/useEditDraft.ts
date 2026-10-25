import { useState } from 'react'
import { pluralize } from '@/shared/lib'
import { buildPatch, dirtyKeys, toggleInList } from './draft'
import type { Draft, FieldDef, FieldValue } from './types'

/** Local form state for the edit drawer: a draft copy of the entity plus change tracking. */
export function useEditDraft(fields: FieldDef[], original: Draft) {
  const [draft, setDraft] = useState<Draft>(() => structuredClone(original))

  const dirty = new Set(dirtyKeys(fields, draft, original))

  return {
    draft,
    setField: (key: string, value: FieldValue) => setDraft((d) => ({ ...d, [key]: value })),
    toggleOption: (key: string, value: string | number) =>
      setDraft((d) => ({ ...d, [key]: toggleInList((d[key] as Array<string | number>) ?? [], value) })),
    isDirty: (key: string) => dirty.has(key),
    dirtyCount: dirty.size,
    dirtyLabel: dirty.size ? pluralize(dirty.size, 'change') : 'No changes',
    getPatch: () => buildPatch(fields, draft, original),
  }
}
