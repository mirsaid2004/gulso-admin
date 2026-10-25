export type ComposerMode = 'changes' | 'reject'

/** Labels and presets live under `review.composer.<mode>` in the locale files. */
export const COMPOSER_CONFIG = {
  changes: { submitVariant: 'dark' },
  reject: { submitVariant: 'danger' },
} as const satisfies Record<ComposerMode, { submitVariant: 'dark' | 'danger' }>
