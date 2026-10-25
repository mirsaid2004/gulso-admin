import type { Draft, FieldDef, FieldValue } from './types'

/** Order-insensitive for multi-selects, string-insensitive for numbers typed into inputs. */
export function isSameValue(a: FieldValue | undefined, b: FieldValue | undefined): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x) => b.includes(x))
  }
  return String(a ?? '') === String(b ?? '')
}

export function dirtyKeys(fields: FieldDef[], draft: Draft, original: Draft): string[] {
  return fields.filter((f) => !isSameValue(draft[f.key], original[f.key])).map((f) => f.key)
}

/** Number inputs hold strings while typing; coerce them to non-negative numbers. */
export function normalizeValue(field: FieldDef, value: FieldValue): FieldValue {
  if (field.type === 'number') return Math.max(0, Number(value) || 0)
  if (field.type === 'text') return String(value).trim()
  return value
}

/** Only the fields that changed, normalized and ready to PATCH. */
export function buildPatch(fields: FieldDef[], draft: Draft, original: Draft): Draft {
  const changed = new Set(dirtyKeys(fields, draft, original))
  return Object.fromEntries(
    fields.filter((f) => changed.has(f.key)).map((f) => [f.key, normalizeValue(f, draft[f.key])]),
  )
}

export function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

/** Entities are plain JSON objects; view them as a field map for the generic drawer. */
export function toDraft(entity: object): Draft {
  return entity as unknown as Draft
}
