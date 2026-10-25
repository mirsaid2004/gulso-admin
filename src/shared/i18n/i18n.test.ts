import { describe, expect, it } from 'vitest'
import { i18n, toLanguage } from '@/shared/i18n'

describe('toLanguage', () => {
  it('maps supported languages and regional variants', () => {
    expect(toLanguage('ru')).toBe('ru')
    expect(toLanguage('en-US')).toBe('en')
    expect(toLanguage('uz-Latn-UZ')).toBe('uz')
  })

  it('falls back to Uzbek for anything else', () => {
    expect(toLanguage('de')).toBe('uz')
    expect(toLanguage(undefined)).toBe('uz')
  })
})

describe('plurals', () => {
  it('uses all Russian plural forms', async () => {
    await i18n.changeLanguage('ru')
    expect(i18n.t('edit.changes', { count: 1 })).toBe('1 изменение')
    expect(i18n.t('edit.changes', { count: 3 })).toBe('3 изменения')
    expect(i18n.t('edit.changes', { count: 5 })).toBe('5 изменений')
    expect(i18n.t('edit.changes', { count: 21 })).toBe('21 изменение')
  })

  it('uses English singular and plural', () => {
    expect(i18n.t('edit.changes', { count: 1 })).toBe('1 change')
    expect(i18n.t('edit.changes', { count: 2 })).toBe('2 changes')
  })
})
