export type ComposerMode = 'changes' | 'reject'

export interface ComposerConfig {
  label: string
  placeholder: string
  submitLabel: string
  submitVariant: 'dark' | 'danger'
  presets: Array<{ label: string; text: string }>
}

export const COMPOSER_CONFIG: Record<ComposerMode, ComposerConfig> = {
  changes: {
    label: 'What should the seller fix?',
    placeholder: 'Write a note the seller will see',
    submitLabel: 'Send to seller',
    submitVariant: 'dark',
    presets: [
      {
        label: 'Unreadable document',
        text: 'The registration certificate photo is unreadable. Please upload a clear scan or PDF.',
      },
      { label: 'STIR mismatch', text: "The STIR in the form doesn't match the certificate. Please re-check it." },
      { label: 'Incomplete address', text: 'Please add the full pickup address including building number.' },
    ],
  },
  reject: {
    label: 'Reason for rejection',
    placeholder: 'The applicant will see this reason',
    submitLabel: 'Reject application',
    submitVariant: 'danger',
    presets: [
      { label: 'Duplicate account', text: 'Duplicate of an existing or blocked account.' },
      { label: 'Prohibited goods', text: 'The described products are not allowed on Gulso.' },
      { label: 'Unverifiable documents', text: "We couldn't verify the submitted documents." },
    ],
  },
}
