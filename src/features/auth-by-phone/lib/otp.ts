export const OTP_LENGTH = 6
export const RESEND_SECONDS = 59

export const emptyOtp = (): string[] => Array(OTP_LENGTH).fill('')

/**
 * Writes typed or pasted digits into the code boxes starting at `index`.
 * Returns the new boxes and the index to focus next.
 */
export function fillOtp(otp: string[], index: number, input: string): { otp: string[]; focus: number } {
  const digits = input.replace(/\D/g, '')
  const next = [...otp]
  if (!digits) {
    next[index] = ''
    return { otp: next, focus: index }
  }
  // A single typed key replaces the box; several digits (paste / autofill) spread forward.
  const chars = digits.length === 1 ? digits : digits.slice(0, OTP_LENGTH - index)
  ;[...chars].forEach((d, i) => (next[index + i] = d))
  return { otp: next, focus: Math.min(index + chars.length, OTP_LENGTH - 1) }
}

export const isOtpComplete = (otp: string[]) => otp.every((d) => /^\d$/.test(d))

/** 59 → "00:59" */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
