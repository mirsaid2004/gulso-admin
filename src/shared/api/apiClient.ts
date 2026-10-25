// With mocking on, always use same-origin so requests hit the MSW handlers.
const BASE_URL =
  import.meta.env.VITE_API_MOCKING === 'enabled' ? '' : (import.meta.env.VITE_API_BASE_URL ?? '')

export const API_PREFIX = '/api/v1'

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: { code: string; message: string }
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  // Absolute URL so the same client works in the browser and under Node (tests).
  const origin = BASE_URL || window.location.origin
  const res = await fetch(`${origin}${API_PREFIX}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const err = (await res.json()) as Partial<ApiResponse<unknown>>
      message = err.error?.message ?? message
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message)
  }

  const json = (await res.json()) as ApiResponse<T>
  return json.data
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
}
