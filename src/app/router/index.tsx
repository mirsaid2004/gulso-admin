import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { AdminLayout } from '@/widgets/admin-layout'
import { LOGIN_ROUTE, ROUTES } from '@/shared/config'
import { GuestOnly, RequireAuth } from './guards'

// Pages are code-split per route. Exported separately so tests can mount it in a memory router.
export const routes: RouteObject[] = [
  {
    element: <GuestOnly />,
    children: [
      { path: LOGIN_ROUTE, lazy: () => import('@/pages/login').then((m) => ({ Component: m.LoginPage })) },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.requests} replace /> },
          {
            path: ROUTES.requests,
            lazy: () => import('@/pages/shop-requests').then((m) => ({ Component: m.ShopRequestsPage })),
          },
          { path: ROUTES.shops, lazy: () => import('@/pages/shops').then((m) => ({ Component: m.ShopsPage })) },
          {
            path: ROUTES.products,
            lazy: () => import('@/pages/products').then((m) => ({ Component: m.ProductsPage })),
          },
          { path: ROUTES.orders, lazy: () => import('@/pages/orders').then((m) => ({ Component: m.OrdersPage })) },
          { path: ROUTES.users, lazy: () => import('@/pages/users').then((m) => ({ Component: m.UsersPage })) },
          { path: '*', element: <Navigate to={ROUTES.requests} replace /> },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
