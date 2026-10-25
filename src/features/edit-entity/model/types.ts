export type EntityKind = 'shop' | 'product' | 'order' | 'user'

export type FieldValue = string | number | boolean | Array<string | number>

export interface FieldOption {
  value: string | number
  label: string
}

interface BaseField {
  key: string
  label: string
}

export type FieldDef = BaseField &
  (
    | { type: 'text' }
    | { type: 'number'; suffix: string }
    | { type: 'choice'; options: FieldOption[] }
    | { type: 'multi'; options: FieldOption[] }
    | { type: 'toggle'; hint: string }
  )

export type Draft = Record<string, FieldValue>
