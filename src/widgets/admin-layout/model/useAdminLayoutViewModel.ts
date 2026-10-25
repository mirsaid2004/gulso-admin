import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePendingRequestCount } from '@/entities/shop-request'
import { useProfileQuery } from '@/entities/session'
import { useLogout } from '@/features/logout'
import { routeKeyFromPath } from '@/shared/config'
import { useLocale } from '@/shared/i18n'

export function useAdminLayoutViewModel() {
  const { t } = useLocale()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pendingCount = usePendingRequestCount()
  const { data: profile } = useProfileQuery()
  const logout = useLogout()
  const routeKey = routeKeyFromPath(pathname)

  return {
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((open) => !open),
    pendingCount,
    profile,
    logout,
    pageTitle: routeKey ? t(`pages.${routeKey}.title`) : '',
  }
}
