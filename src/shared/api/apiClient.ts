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
  /** Machine-readable code from the error envelope, e.g. "INVALID_OTP" */
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * How the client gets and renews credentials. Registered by the app layer
 * (shared can't import the session entity), see `app/providers/auth.ts`.
 */
export interface ApiAuthBridge {
  getAccessToken: () => string | null
  /** Renews tokens; resolves false when the session can't be renewed. */
  refresh: () => Promise<boolean>
  /** Called once a request is still unauthorized after a refresh attempt. */
  onUnauthorized: () => void
}

let auth: ApiAuthBridge | null = null

export function configureApiAuth(bridge: ApiAuthBridge | null) {
  auth = bridge
}

const isAuthEndpoint = (path: string) => path.startsWith('/auth/')

async function request<T>(method: string, path: string, body?: unknown, retried = false): Promise<T> {
  const token = isAuthEndpoint(path) ? null : (auth?.getAccessToken() ?? null)
  // Absolute URL so the same client works in the browser and under Node (tests).
  const origin = BASE_URL || window.location.origin
  const res = await fetch(`${origin}${API_PREFIX}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && !isAuthEndpoint(path)) {
    if (!retried && (await auth.refresh())) return request<T>(method, path, body, true)
    auth.onUnauthorized()
  }

  if (!res.ok) {
    let code = 'HTTP_ERROR'
    let message = res.statusText
    try {
      const err = (await res.json()) as Partial<ApiResponse<unknown>>
      code = err.error?.code ?? code
      message = err.error?.message ?? message
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, code, message)
  }

  const json = (await res.json()) as ApiResponse<T>
  return json.data
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
}
