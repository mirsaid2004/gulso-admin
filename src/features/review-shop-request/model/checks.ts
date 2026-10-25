export const VERIFICATION_CHECKS = [
  { key: 'docs', label: 'Documents are readable' },
  { key: 'stir', label: 'STIR matches the certificate' },
  { key: 'addr', label: 'Address verified' },
] as const

export type CheckKey = (typeof VERIFICATION_CHECKS)[number]['key']

export type CheckState = Partial<Record<CheckKey, boolean>>

export function countCompleted(state: CheckState = {}): number {
  return VERIFICATION_CHECKS.filter((c) => state[c.key]).length
}

export function allChecksPassed(state: CheckState = {}): boolean {
  return countCompleted(state) === VERIFICATION_CHECKS.length
}

export function approveHint(state: CheckState = {}): string {
  const done = countCompleted(state)
  const total = VERIFICATION_CHECKS.length
  return done === total ? 'All checks passed' : `${done} of ${total} checks done — complete them to approve`
}
