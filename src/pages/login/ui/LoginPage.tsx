import { LoginForm, useLoginViewModel } from '@/features/auth-by-phone'
import { LanguageSwitcher } from '@/features/switch-language'
import { useLocale } from '@/shared/i18n'

export function LoginPage() {
  const { t } = useLocale()
  // Redirecting after sign-in is the GuestOnly route guard's job (it knows where the user came from).
  const vm = useLoginViewModel()

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#fdfdfd]">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex min-h-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-center gap-3">
            <img src="/logo.svg" alt="Gulso" className="size-10" />
            <div className="flex flex-col">
              <span className="text-xl leading-6 font-black tracking-tight uppercase">{t('layout.brand')}</span>
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{t('layout.panel')}</span>
            </div>
          </div>
          <div className="animate-pop rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
            <LoginForm vm={vm} />
          </div>
        </div>
      </div>
    </div>
  )
}
