import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePendingRequestCount } from '@/entities/shop-request'
import { useViewerQuery } from '@/entities/viewer'
import { PAGE_META, routeKeyFromPath } from '@/shared/config'

export function useAdminLayoutViewModel() {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pendingCount = usePendingRequestCount()
  const { data: viewer } = useViewerQuery()
  const routeKey = routeKeyFromPath(pathname)

  return {
    sidebarOpen,
    toggleSidebar: () => setSidebarOpen((open) => !open),
    pendingCount,
    viewer,
    pageTitle: routeKey ? PAGE_META[routeKey].title : '',
  }
}
