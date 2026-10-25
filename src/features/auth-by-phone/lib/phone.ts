export const COUNTRY_CODE = '+998'
const LOCAL_DIGITS = 9

/**
 * Formats what the user typed or pasted as "90 123 45 67". A pasted full
 * number ("+998 90 123 45 67") loses its country code.
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.length > LOCAL_DIGITS && digits.startsWith('998')) digits = digits.slice(3)
  digits = digits.slice(0, LOCAL_DIGITS)
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ')
}

export function isPhoneComplete(formatted: string): boolean {
  return /^\d{2} \d{3} \d{2} \d{2}$/.test(formatted)
}

/** "90 123 45 67" → "+998901234567" */
export function toInternational(formatted: string): string {
  return `${COUNTRY_CODE}${formatted.replace(/\D/g, '')}`
}
