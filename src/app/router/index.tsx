import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/widgets/admin-layout'
import { ROUTES } from '@/shared/config'

// Pages are code-split per route.
export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.requests} replace /> },
      {
        path: ROUTES.requests,
        lazy: () => import('@/pages/shop-requests').then((m) => ({ Component: m.ShopRequestsPage })),
      },
      { path: ROUTES.shops, lazy: () => import('@/pages/shops').then((m) => ({ Component: m.ShopsPage })) },
      { path: ROUTES.products, lazy: () => import('@/pages/products').then((m) => ({ Component: m.ProductsPage })) },
      { path: ROUTES.orders, lazy: () => import('@/pages/orders').then((m) => ({ Component: m.OrdersPage })) },
      { path: ROUTES.users, lazy: () => import('@/pages/users').then((m) => ({ Component: m.UsersPage })) },
      { path: '*', element: <Navigate to={ROUTES.requests} replace /> },
    ],
  },
])
