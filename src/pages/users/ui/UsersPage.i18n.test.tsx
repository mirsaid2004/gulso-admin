import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { i18n } from '@/shared/i18n'
import { renderWithProviders } from '@/shared/test/render'
import { UsersPage } from './UsersPage'

describe('UsersPage localized', () => {
  it('renders Uzbek copy, role tags and dates', async () => {
    await i18n.changeLanguage('uz')
    renderWithProviders(<UsersPage />, { route: '/users' })

    const mirsaid = (await screen.findByText('Mirsaid')).closest('tr')!
    expect(screen.getByRole('heading', { name: 'Foydalanuvchilar' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sotuvchilar 3' })).toBeInTheDocument()
    expect(within(mirsaid).getByText('SOTUVCHI')).toBeInTheDocument()
    expect(within(mirsaid).getByRole('button', { name: 'Bloklash' })).toBeInTheDocument()
    expect(within(mirsaid).getByText('1-yan, 2026')).toBeInTheDocument()
  })

  it('renders Russian copy', async () => {
    await i18n.changeLanguage('ru')
    renderWithProviders(<UsersPage />, { route: '/users' })

    const jasur = (await screen.findByText('Jasur Tursunov')).closest('tr')!
    expect(screen.getByRole('searchbox', { name: 'Поиск пользователей' })).toBeInTheDocument()
    expect(within(jasur).getByText('ЗАБЛОКИРОВАН')).toBeInTheDocument()
    expect(within(jasur).getByRole('button', { name: 'Разблокировать' })).toBeInTheDocument()
  })
})
