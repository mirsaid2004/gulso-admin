/** Each key is also the `review.checks.*` translation key. */
export const VERIFICATION_CHECKS = ['docs', 'stir', 'addr'] as const

export type CheckKey = (typeof VERIFICATION_CHECKS)[number]

export type CheckState = Partial<Record<CheckKey, boolean>>

export function countCompleted(state: CheckState = {}): number {
  return VERIFICATION_CHECKS.filter((key) => state[key]).length
}

export function allChecksPassed(state: CheckState = {}): boolean {
  return countCompleted(state) === VERIFICATION_CHECKS.length
}
