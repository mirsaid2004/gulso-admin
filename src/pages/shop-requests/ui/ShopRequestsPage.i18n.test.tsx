import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { i18n } from '@/shared/i18n'
import { renderWithProviders } from '@/test/render'
import { ShopRequestsPage } from './ShopRequestsPage'

describe('ShopRequestsPage localized', () => {
  it('reviews in Russian: plural owner tag, hint, presets and toast', async () => {
    await i18n.changeLanguage('ru')
    const user = userEvent.setup()
    renderWithProviders(<ShopRequestsPage />, { route: '/requests' })

    const details = await screen.findByRole('generic', { name: 'Заявка Bake & Bloom' })
    expect(within(details).getByText("Действующий продавец · 2 магазина: Gullar do'koni, Flora Art")).toBeInTheDocument()
    expect(within(details).getByText('Выполнено проверок: 0 из 3 — завершите все, чтобы одобрить')).toBeInTheDocument()
    expect(within(details).getByText('ООО (MChJ)')).toBeInTheDocument()

    await user.click(within(details).getByRole('button', { name: 'Запросить исправления' }))
    await user.click(within(details).getByRole('button', { name: 'Неполный адрес' }))
    await user.click(within(details).getByRole('button', { name: 'Отправить продавцу' }))

    expect(await screen.findByText('Исправления запрошены')).toBeInTheDocument()
    expect(screen.getByText('Mirsaid увидит ваш комментарий.')).toBeInTheDocument()
  })

  it('shows request ages in Uzbek', async () => {
    await i18n.changeLanguage('uz')
    renderWithProviders(<ShopRequestsPage />, { route: '/requests' })

    expect(await screen.findByText('2 soat')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Kutilmoqda 3' })).toHaveAttribute('aria-selected', 'true')
  })
})
