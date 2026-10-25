const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const pad = (n: number) => String(n).padStart(2, '0')

/** Date-only ISO strings ("2026-01-09") parse as UTC midnight; treat them as local dates instead. */
const parseLocal = (iso: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso)

/** 1234567 → "1 234 567" (space-grouped, as used for UZS amounts). */
export function formatNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatUzs(value: number): string {
  return `${formatNumber(value)} UZS`
}

/** "2026-01-09" → "Jan 9, 2026" */
export function formatDate(iso: string): string {
  const d = parseLocal(iso)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** "2026-10-14T10:42:00" → "Oct 14, 10:42" */
export function formatShortDateTime(iso: string): string {
  const d = parseLocal(iso)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** "2026-10-14T09:12:00" → "Oct 14, 2026 · 09:12" */
export function formatDateTime(iso: string): string {
  const d = parseLocal(iso)
  return `${formatDate(iso)} · ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Compact age of a timestamp: "now", "5m", "2h", "3d". */
export function formatAge(iso: string, now: Date = new Date()): string {
  const minutes = Math.floor((now.getTime() - parseLocal(iso).getTime()) / 60_000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
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

/** "1 change" / "3 changes" */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}
