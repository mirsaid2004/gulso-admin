import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditEntityDrawer } from './EditEntityDrawer'
import { shopFields, userFields } from '../model/schemas'

const users = [
  { id: 123, name: 'Mirsaid' },
  { id: 124, name: 'Aziza Karimova' },
]
const shop = { id: 4, name: 'Flora Art', ownerId: 123, categories: ['FLOWERS', 'GIFTS'], commission: 10, suspended: false }

function renderShopDrawer(onSave = vi.fn(), onClose = vi.fn()) {
  render(
    <EditEntityDrawer
      kind="shop"
      entityId={4}
      fields={shopFields(users)}
      original={shop}
      onSave={onSave}
      onClose={onClose}
    />,
  )
  return { onSave, onClose, dialog: screen.getByRole('dialog') }
}

describe('EditEntityDrawer', () => {
  it('shows the entity and disables saving until something changes', () => {
    const { dialog } = renderShopDrawer()

    expect(within(dialog).getByRole('heading', { name: 'Flora Art' })).toBeInTheDocument()
    expect(within(dialog).getByText('Shop · ID 4')).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Shop name')).toHaveValue('Flora Art')
    expect(within(dialog).getByText('No changes')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('marks edited fields and saves only the changes', async () => {
    const user = userEvent.setup()
    const { onSave, dialog } = renderShopDrawer()

    const commission = within(dialog).getByLabelText('Platform commission')
    await user.clear(commission)
    await user.type(commission, '15')
    await user.click(within(dialog).getByRole('button', { name: 'Aziza Karimova' }))
    await user.click(within(dialog).getByRole('switch'))

    expect(within(dialog).getAllByText('EDITED')).toHaveLength(3)
    expect(within(dialog).getByText('3 changes')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))
    expect(onSave).toHaveBeenCalledWith({ ownerId: 124, commission: 15, suspended: true }, 'Flora Art')
  })

  it('updates the title live while renaming', async () => {
    const user = userEvent.setup()
    const { onSave, dialog } = renderShopDrawer()

    const name = within(dialog).getByLabelText('Shop name')
    await user.clear(name)
    await user.type(name, 'Flora Art Studio')

    expect(within(dialog).getByRole('heading', { name: 'Flora Art Studio' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))
    expect(onSave).toHaveBeenCalledWith({ name: 'Flora Art Studio' }, 'Flora Art Studio')
  })

  it('toggles multi-select chips', async () => {
    const user = userEvent.setup()
    render(
      <EditEntityDrawer
        kind="user"
        entityId={131}
        fields={userFields()}
        original={{ id: 131, name: 'Kamola', phone: '+998', roles: ['USER'], blocked: false }}
        onSave={() => {}}
        onClose={() => {}}
      />,
    )

    const seller = screen.getByRole('button', { name: 'Seller' })
    expect(seller).toHaveAttribute('aria-pressed', 'false')
    await user.click(seller)
    expect(seller).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Buyer' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('closes from Cancel and from the close button', async () => {
    const user = userEvent.setup()
    const { onClose, dialog } = renderShopDrawer()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await user.click(within(dialog).getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
