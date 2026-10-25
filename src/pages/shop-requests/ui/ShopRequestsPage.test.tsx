import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/shared/test/render'
import { ShopRequestsPage } from './ShopRequestsPage'

async function setup() {
  const user = userEvent.setup()
  renderWithProviders(<ShopRequestsPage />, { route: '/requests' })
  const details = await screen.findByRole('generic', { name: 'Bake & Bloom application' })
  return { user, details }
}

describe('ShopRequestsPage', () => {
  it('shows the selected application with owner context', async () => {
    const { details } = await setup()

    expect(within(details).getByText('UNDER REVIEW')).toBeInTheDocument()
    expect(within(details).getByText("Existing seller · 2 shops: Gullar do'koni, Flora Art")).toBeInTheDocument()
    expect(within(details).getByText('LLC (MChJ)')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Pending 3' })).toHaveAttribute('aria-selected', 'true')
  })

  it('approves after all checks and moves on to the next pending request', async () => {
    const { user, details } = await setup()
    const approve = within(details).getByRole('button', { name: /approve & open shop/i })

    expect(approve).toBeDisabled()
    for (const check of within(details).getAllByRole('checkbox')) await user.click(check)
    expect(approve).toBeEnabled()
    await user.click(approve)

    expect(await screen.findByText('Bake & Bloom approved')).toBeInTheDocument()
    expect(await screen.findByRole('generic', { name: 'Tulip House application' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Pending 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Approved 1' })).toBeInTheDocument()
  })

  it('rejects with a reason, which then shows on the Rejected tab', async () => {
    const { user, details } = await setup()

    await user.click(within(details).getByRole('button', { name: 'Reject' }))
    const send = within(details).getByRole('button', { name: 'Reject application' })
    expect(send).toBeDisabled()

    await user.type(within(details).getByLabelText('Reason for rejection'), 'Prohibited goods')
    await user.click(send)

    expect(await screen.findByText('Bake & Bloom rejected')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /rejected/i }))
    await user.click(screen.getByRole('button', { name: /bake & bloom/i }))
    const rejected = screen.getByRole('generic', { name: 'Bake & Bloom application' })
    expect(within(rejected).getByText('Rejection reason')).toBeInTheDocument()
    expect(within(rejected).getByText('Prohibited goods')).toBeInTheDocument()
    expect(within(rejected).queryByRole('button', { name: /approve/i })).not.toBeInTheDocument()
  })

  it('fills the note from a preset when requesting changes', async () => {
    const { user, details } = await setup()

    await user.click(within(details).getByRole('button', { name: 'Request changes' }))
    await user.click(within(details).getByRole('button', { name: 'Incomplete address' }))

    expect(within(details).getByLabelText('What should the seller fix?')).toHaveValue(
      'Please add the full pickup address including building number.',
    )
  })

  it('shows the previous note on a resubmitted request', async () => {
    const { user } = await setup()

    await user.click(screen.getByRole('button', { name: /choco lab/i }))

    const details = screen.getByRole('generic', { name: 'Choco Lab application' })
    expect(within(details).getByText('Previous note — seller resubmitted')).toBeInTheDocument()
  })

  it('shows an empty state when the search matches nothing', async () => {
    const { user } = await setup()

    await user.type(screen.getByRole('searchbox', { name: 'Search shop requests' }), 'zzz')

    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.queryByRole('generic', { name: /application/ })).not.toBeInTheDocument()
  })
})
