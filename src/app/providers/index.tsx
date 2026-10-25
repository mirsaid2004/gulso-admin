import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/shared/api'
import { Toaster } from '@/shared/ui'
import { setupApiAuth } from './auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Auth failures are handled by the API client; retrying them only delays the redirect.
      retry: (failureCount, error) => !(error instanceof ApiError && error.status === 401) && failureCount < 1,
    },
  },
})

setupApiAuth(queryClient)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
