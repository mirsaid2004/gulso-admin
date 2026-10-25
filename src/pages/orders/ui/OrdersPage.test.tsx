import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { db } from '@/mocks/db'
import { renderWithProviders } from '@/shared/test/render'
import { OrdersPage } from './OrdersPage'

const row = (orderId: number) => screen.getByText(`Order #${orderId}`).closest('tr')!

describe('OrdersPage', () => {
  it('lists orders with commission from the shop rate', async () => {
    db.shops.find((s) => s.id === 1)!.commission = 15
    renderWithProviders(<OrdersPage />, { route: '/orders' })

    await screen.findByText('Order #12')
    expect(within(row(12)).getByText('50 895 · 15%')).toBeInTheDocument()
    expect(within(row(11)).getByText('60 000 · 10%')).toBeInTheDocument()
  })

  it('only offers Cancel on unfinished orders, and cancels', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrdersPage />, { route: '/orders' })
    await screen.findByText('Order #12')

    expect(within(row(8)).queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    await user.click(within(row(12)).getByRole('button', { name: 'Cancel' }))

    expect(await screen.findByText('Order #12 cancelled')).toBeInTheDocument()
    expect(await within(row(12)).findByText('CANCELLED')).toBeInTheDocument()
    expect(within(row(12)).queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('scopes to a shop from the URL and clears the filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrdersPage />, { route: '/orders?shop=4' })

    const chip = await screen.findByRole('button', { name: 'Clear filter Shop: Flora Art' })
    expect(screen.getAllByRole('row')).toHaveLength(2) // header + Order #11

    await user.click(chip)
    expect(screen.getAllByRole('row')).toHaveLength(9)
  })

  it('searches by customer phone and filters by status tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrdersPage />, { route: '/orders' })
    await screen.findByText('Order #12')

    await user.type(screen.getByRole('searchbox', { name: 'Search orders' }), '777 30 21')
    expect(screen.getByText('Order #11')).toBeInTheDocument()
    expect(screen.getByText('Order #5')).toBeInTheDocument()
    expect(screen.queryByText('Order #12')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /new/i }))
    expect(screen.queryByText('Order #11')).not.toBeInTheDocument()
    expect(screen.getByText('Order #5')).toBeInTheDocument()
  })
})
