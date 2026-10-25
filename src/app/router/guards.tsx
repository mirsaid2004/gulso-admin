import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { useIsAuthenticated } from '@/entities/session'
import { LOGIN_ROUTE, ROUTES } from '@/shared/config'

/** Signed-in area: anonymous visitors go to the login page, remembering where they were headed. */
export function RequireAuth() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />
  return <Outlet />
}

/**
 * Login page: once signed in (including right after a successful login) the user
 * is sent to the page they originally asked for, or to Shop requests.
 */
export function GuestOnly() {
  const isAuthenticated = useIsAuthenticated()
  const { state } = useLocation() as { state: { from?: Location } | null }
  if (isAuthenticated) {
    const from = state?.from
    return <Navigate to={from ? `${from.pathname}${from.search}` : ROUTES.requests} replace />
  }
  return <Outlet />
}
