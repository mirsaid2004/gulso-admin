import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/shared/lib/format'
import { toLanguage, type Language } from './config'

/** Translation function plus the active language, for components and view-models. */
export function useLocale() {
  const { t, i18n } = useTranslation()
  const language: Language = toLanguage(i18n.resolvedLanguage ?? i18n.language)
  return {
    t,
    language,
    changeLanguage: (lng: Language) => i18n.changeLanguage(lng),
    /** 339300 → "339 300 UZS" / "339 300 so'm" / "339 300 сум" */
    money: (value: number) => `${formatNumber(value)} ${t('common.currency')}`,
  }
}
