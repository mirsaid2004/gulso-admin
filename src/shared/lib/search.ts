export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase()
}

/** True when the query is empty or any of the values contains it (case-insensitive). */
export function matchesQuery(query: string, ...values: Array<string | number | null | undefined>): boolean {
  const q = normalizeQuery(query)
  if (!q) return true
  return values.some((value) => value != null && String(value).toLowerCase().includes(q))
}
