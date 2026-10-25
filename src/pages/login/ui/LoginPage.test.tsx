import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SESSION_STORAGE_KEY, useSessionStore } from '@/entities/session'
import { db } from '@/mocks/db'
import { renderApp } from '@/test/render'
import { signOut } from '@/test/session'

const MAINTAINER = '900000001' // Dilnoza K., the seeded maintainer

async function openLogin(route = '/requests') {
  signOut()
  const user = userEvent.setup()
  const app = renderApp(route)
  await screen.findByRole('heading', { name: 'Welcome' })
  return { user, ...app }
}

async function requestCode(user: ReturnType<typeof userEvent.setup>, digits = MAINTAINER) {
  await user.type(screen.getByLabelText('Phone number'), digits)
  await user.click(screen.getByRole('button', { name: 'Send code' }))
}

describe('Login', () => {
  afterEach(() => vi.useRealTimers())

  it('redirects anonymous visitors to the login page', async () => {
    const { router } = await openLogin('/shops')
    expect(router.state.location.pathname).toBe('/login')
  })

  it('formats the phone and only enables Send for a full number', async () => {
    const { user } = await openLogin()
    const input = screen.getByLabelText('Phone number')

    await user.type(input, '9000000')
    expect(input).toHaveValue('90 000 00')
    expect(screen.getByRole('button', { name: 'Send code' })).toBeDisabled()

    await user.type(input, '01')
    expect(input).toHaveValue('90 000 00 01')
    expect(screen.getByRole('button', { name: 'Send code' })).toBeEnabled()
  })

  it('signs in with phone + SMS code and returns to the page that was asked for', async () => {
    const { user, router } = await openLogin('/orders?shop=4')
    await requestCode(user)

    expect(await screen.findByRole('heading', { name: 'Enter the code' })).toBeInTheDocument()
    expect(screen.getByText('+998 90 000 00 01')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verify' })).toBeDisabled()

    // Pasting / SMS autofill puts the whole code into the first box.
    await user.click(screen.getByLabelText('Digit 1'))
    await user.paste('123456')
    expect(screen.getByLabelText('Digit 6')).toHaveValue('6')
    await user.click(screen.getByRole('button', { name: 'Verify' }))

    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(router.state.location.pathname + router.state.location.search).toBe('/orders?shop=4')
    expect(useSessionStore.getState().user).toEqual({ id: 1, name: 'Dilnoza K.', roles: ['ADMIN'] })
    expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)!).state.isAuthenticated).toBe(true)
    expect(await screen.findByText('Dilnoza K.')).toBeInTheDocument()
  })

  it('rejects a wrong code and clears the boxes', async () => {
    const { user } = await openLogin()
    await requestCode(user)
    await screen.findByRole('heading', { name: 'Enter the code' })

    await user.click(screen.getByLabelText('Digit 1'))
    await user.keyboard('111111')
    await user.click(screen.getByRole('button', { name: 'Verify' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong code. Try again')
    expect(screen.getByLabelText('Digit 1')).toHaveValue('')
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
  })

  it('does not let non-maintainers in', async () => {
    const { user } = await openLogin()
    await requestCode(user, '979997969') // Mirsaid, a seller

    expect(await screen.findByRole('alert')).toHaveTextContent('This number has no access to the maintainer panel')
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
  })

  it('moves back with Backspace and returns to the phone step', async () => {
    const { user } = await openLogin()
    await requestCode(user)
    await screen.findByRole('heading', { name: 'Enter the code' })

    await user.keyboard('12')
    expect(screen.getByLabelText('Digit 3')).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(screen.getByLabelText('Digit 2')).toHaveFocus()
    expect(screen.getByLabelText('Digit 2')).toHaveValue('')

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByLabelText('Phone number')).toHaveValue('90 000 00 01')
  })

  it('allows resending only after the countdown', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { user } = await openLogin()
    await requestCode(user)
    await screen.findByRole('heading', { name: 'Enter the code' })

    expect(screen.getByText('Resend in 00:59')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Resend code' })).not.toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(59_000)
    await user.click(await screen.findByRole('button', { name: 'Resend code' }))

    expect(await screen.findByText('Resend in 00:59')).toBeInTheDocument()
  })

  it('sends signed-in users away from /login', async () => {
    const { router } = renderApp('/login')
    await waitFor(() => expect(router.state.location.pathname).toBe('/requests'))
    expect(db.sessions).toHaveLength(1)
  })
})
