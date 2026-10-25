import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { i18n, LANGUAGE_STORAGE_KEY } from '@/shared/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('shows the current language', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveTextContent('EN')
  })

  it('switches language, remembers it and updates <html lang>', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('combobox', { name: 'Language' }))
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      "UZ O'zbek",
      'RU Русский',
      'EN English',
    ])
    await user.click(screen.getByRole('option', { name: /русский/i }))

    expect(i18n.language).toBe('ru')
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('ru')
    expect(document.documentElement.lang).toBe('ru')
    expect(screen.getByRole('combobox', { name: 'Язык' })).toHaveTextContent('RU')
  })
})
