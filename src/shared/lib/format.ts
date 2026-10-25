const pad = (n: number) => String(n).padStart(2, '0')

/** Date-only ISO strings ("2026-01-09") parse as UTC midnight; treat them as local dates instead. */
const parseLocal = (iso: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso)

/** 1234567 → "1 234 567" (space-grouped, as used for UZS amounts in every locale). */
export function formatNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Browsers ship incomplete CLDR data for Uzbek (Chrome renders "M10 14"), so Uzbek dates are formatted by hand.
const UZ_MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']
const isUzbek = (locale: string) => locale.split('-')[0] === 'uz'
const uzDay = (d: Date) => `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`
const time = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

/** "2026-01-09" → "Jan 9, 2026" (en) / "9 янв. 2026 г." (ru) / "9-yan, 2026" (uz) */
export function formatDate(iso: string, locale = 'en'): string {
  const d = parseLocal(iso)
  if (isUzbek(locale)) return `${uzDay(d)}, ${d.getFullYear()}`
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}

/** "2026-10-14T10:42:00" → "Oct 14, 10:42" (en) / "14 окт., 10:42" (ru) / "14-okt, 10:42" (uz) */
export function formatShortDateTime(iso: string, locale = 'en'): string {
  const d = parseLocal(iso)
  if (isUzbek(locale)) return `${uzDay(d)}, ${time(d)}`
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(d)
}

/** "2026-10-14T09:12:00" → "Oct 14, 2026 · 09:12" */
export function formatDateTime(iso: string, locale = 'en'): string {
  return `${formatDate(iso, locale)} · ${time(parseLocal(iso))}`
}

export type AgeUnit = 'now' | 'minutes' | 'hours' | 'days'

/** Compact age of a timestamp as a unit + count, e.g. { unit: 'hours', count: 2 } → "2h". */
export function getAge(iso: string, now: Date = new Date()): { unit: AgeUnit; count: number } {
  const minutes = Math.floor((now.getTime() - parseLocal(iso).getTime()) / 60_000)
  if (minutes < 1) return { unit: 'now', count: 0 }
  if (minutes < 60) return { unit: 'minutes', count: minutes }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { unit: 'hours', count: hours }
  return { unit: 'days', count: Math.floor(hours / 24) }
}

/** Two-letter monogram: "Bake & Bloom" → "BB", "Gullar do'koni" → "GD". */
export function monogram(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}' ]/gu, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
