import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { UsersPage } from './UsersPage'

const row = (name: string) => screen.getByText(name).closest('tr')!

describe('UsersPage', () => {
  it('does not allow blocking maintainers', async () => {
    renderWithProviders(<UsersPage />, { route: '/users' })
    await screen.findByText('Dilnoza K.')

    expect(within(row('Dilnoza K.')).queryByRole('button', { name: 'Block' })).not.toBeInTheDocument()
    expect(within(row('Mirsaid')).getByRole('button', { name: 'Block' })).toBeInTheDocument()
  })

  it('blocks a user and updates the Blocked tab count', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UsersPage />, { route: '/users' })
    await screen.findByText('Kamola Yusupova')

    expect(screen.getByRole('tab', { name: 'Blocked 1' })).toBeInTheDocument()
    await user.click(within(row('Kamola Yusupova')).getByRole('button', { name: 'Block' }))

    expect(await within(row('Kamola Yusupova')).findByRole('button', { name: 'Unblock' })).toBeInTheDocument()
    expect(within(row('Kamola Yusupova')).getByText('BLOCKED')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Blocked 2' })).toBeInTheDocument()
  })

  it('edits a user through the drawer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UsersPage />, { route: '/users' })
    await screen.findByText('Timur Aliyev')

    await user.click(within(row('Timur Aliyev')).getByRole('button', { name: 'Edit' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Seller' }))
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Timur Aliyev updated')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(await within(row('Timur Aliyev')).findByText('SELLER')).toBeInTheDocument()
  })
})
