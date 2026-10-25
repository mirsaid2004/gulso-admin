import { Check, ChevronDown } from 'lucide-react'
import { Select } from 'radix-ui'
import { LANGUAGES, LANGUAGE_META, useLocale, type Language } from '@/shared/i18n'

function Flag({ language }: { language: Language }) {
  return (
    <img
      src={LANGUAGE_META[language].flag}
      alt=""
      width={20}
      height={14}
      className="shrink-0 rounded-xs object-cover shadow-sm"
    />
  )
}

export function LanguageSwitcher() {
  const { t, language, changeLanguage } = useLocale()

  return (
    <Select.Root value={language} onValueChange={(v) => changeLanguage(v as Language)}>
      <Select.Trigger
        aria-label={t('common.language')}
        className="flex h-10 items-center gap-2 rounded-[10px] border-none bg-transparent px-3 text-slate-600 outline-none transition-colors hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Select.Value>
          <span className="flex items-center gap-2">
            <Flag language={language} />
            <span className="text-sm font-bold">{LANGUAGE_META[language].label}</span>
          </span>
        </Select.Value>
        <Select.Icon>
          <ChevronDown className="size-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          align="end"
          sideOffset={6}
          className="z-50 min-w-40 overflow-hidden rounded-xl border border-border bg-white p-1 shadow-lg"
        >
          <Select.Viewport>
            {LANGUAGES.map((lng) => (
              <Select.Item
                key={lng}
                value={lng}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-highlighted:bg-primary/5 data-highlighted:text-primary"
              >
                <Flag language={lng} />
                {/* ItemText names the option for screen readers, so it includes the native name */}
                <Select.ItemText>
                  <span className="flex items-center gap-2.5">
                    <span className="font-bold">{LANGUAGE_META[lng].label}</span>{' '}
                    <span className="text-xs text-muted-foreground">{LANGUAGE_META[lng].nativeLabel}</span>
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator className="ml-auto text-primary">
                  <Check className="size-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
