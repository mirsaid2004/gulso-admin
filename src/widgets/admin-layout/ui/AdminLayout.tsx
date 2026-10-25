import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useAdminLayoutViewModel } from '../model/useAdminLayoutViewModel'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  const vm = useAdminLayoutViewModel()

  return (
    <div className="flex min-h-screen w-full">
      {vm.sidebarOpen && <AdminSidebar pendingCount={vm.pendingCount} viewer={vm.viewer} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader pageTitle={vm.pageTitle} pendingCount={vm.pendingCount} onToggleSidebar={vm.toggleSidebar} />
        <main className="flex flex-1 flex-col gap-8 p-8 pb-[72px]">
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  )
}
