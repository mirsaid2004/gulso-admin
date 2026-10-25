export const LANGUAGES = ['uz', 'ru', 'en'] as const

export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'uz'

export const LANGUAGE_META: Record<Language, { label: string; nativeLabel: string; flag: string }> = {
  uz: { label: 'UZ', nativeLabel: "O'zbek", flag: '/uz.png' },
  ru: { label: 'RU', nativeLabel: 'Русский', flag: '/ru.png' },
  en: { label: 'EN', nativeLabel: 'English', flag: '/en.png' },
}

export const LANGUAGE_STORAGE_KEY = 'admin-lang'

export function toLanguage(value: string | undefined): Language {
  const base = value?.split('-')[0]
  return (LANGUAGES as readonly string[]).includes(base ?? '') ? (base as Language) : DEFAULT_LANGUAGE
}
