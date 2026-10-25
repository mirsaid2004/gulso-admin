import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSessionStore } from '@/entities/session'
import { db } from '@/mocks/db'
import { apiClient } from '@/shared/api'
import { renderApp } from '@/test/render'

describe('API auth', () => {
  it('sends the access token on admin requests', async () => {
    const users = await apiClient.get<unknown[]>('/admin/users')
    expect(users).toHaveLength(8)
  })

  it('refreshes an expired access token once and retries the request', async () => {
    const { refreshToken } = useSessionStore.getState()
    db.sessions[0].accessToken = 'expired' // server no longer accepts the stored access token

    const users = await apiClient.get<unknown[]>('/admin/users')

    expect(users).toHaveLength(8)
    const state = useSessionStore.getState()
    expect(state.refreshToken).not.toBe(refreshToken)
    expect(db.sessions).toEqual([{ userId: 1, accessToken: state.accessToken, refreshToken: state.refreshToken }])
  })

  it('shares one refresh between concurrent 401s', async () => {
    db.sessions[0].accessToken = 'expired'

    const results = await Promise.all([apiClient.get('/admin/users'), apiClient.get('/admin/shops')])

    expect(results).toHaveLength(2)
    expect(db.sessions).toHaveLength(1)
  })

  it('signs out when the session cannot be renewed', async () => {
    db.sessions.length = 0 // both tokens revoked server-side

    await expect(apiClient.get('/admin/users')).rejects.toMatchObject({ status: 401 })
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
  })

  it('shows the login page when the session dies while using the app', async () => {
    db.sessions.length = 0
    const { router } = renderApp('/users')

    expect(await screen.findByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })
})

describe('Logout', () => {
  it('revokes the session server-side and returns to the login page', async () => {
    const user = userEvent.setup()
    renderApp('/requests')
    const sidebar = await screen.findByRole('complementary')
    await within(sidebar).findByText('Dilnoza K.')

    await user.click(within(sidebar).getByRole('button', { name: 'Log out' }))

    expect(await screen.findByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    await waitFor(() => expect(db.sessions).toHaveLength(0))
    expect(useSessionStore.getState()).toMatchObject({ accessToken: null, user: null, isAuthenticated: false })
  })
})
