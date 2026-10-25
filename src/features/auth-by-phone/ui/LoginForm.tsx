import type { ReactNode } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Trans } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { LoginViewModel } from '../model/useLoginViewModel'

// Demo credentials shown under the form while the API is mocked.
const DEMO = import.meta.env.VITE_API_MOCKING === 'enabled' ? { phone: '90 000 00 01', code: '123456' } : null

const submitButton =
  'flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#e7236a_0%,#c41d5e_100%)] text-sm font-black text-white shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'

function ErrorBox({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-500">
      {message}
    </p>
  )
}

function Heading({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <>
      <h1 className="mb-1 text-2xl font-black text-slate-900">{title}</h1>
      <p className="mb-8 text-sm font-medium text-slate-400">{subtitle}</p>
    </>
  )
}

function PhoneStep({ vm }: { vm: LoginViewModel }) {
  const { t } = useLocale()
  return (
    <>
      <Heading title={t('login.title')} subtitle={t('login.subtitle')} />
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          vm.sendCode()
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-phone" className="text-xs font-black tracking-widest text-slate-500 uppercase">
            {t('login.phoneLabel')}
          </label>
          <div className="group relative flex items-center">
            <div className="absolute inset-y-0 left-0 z-10 flex w-20 items-center justify-center rounded-l-xl border-r border-slate-200 bg-slate-50 transition-colors group-focus-within:border-primary/50 group-focus-within:bg-primary/5">
              <span className="text-sm font-bold text-slate-600">+998</span>
            </div>
            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              autoFocus
              value={vm.phone}
              onChange={(e) => vm.changePhone(e.target.value)}
              placeholder={t('login.phonePlaceholder')}
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-24 text-lg font-black tracking-widest text-slate-900 transition-all placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-300 focus:border-primary/40 focus:bg-white focus:outline-none"
            />
          </div>
          <p className="mt-1 text-center text-xs font-medium text-slate-400">{t('login.phoneHint')}</p>
        </div>

        {vm.error && <ErrorBox message={vm.error} />}

        <button type="submit" disabled={!vm.canSend} className={cn(submitButton, 'mt-1')}>
          {vm.isSending && <Loader2 className="size-4 animate-spin" />}
          {t('login.sendCode')}
        </button>
      </form>
    </>
  )
}

function OtpStep({ vm }: { vm: LoginViewModel }) {
  const { t } = useLocale()
  return (
    <>
      <button
        type="button"
        onClick={vm.back}
        className="mb-6 flex items-center gap-1.5 border-none bg-transparent p-0 text-xs font-bold text-slate-400 transition-colors hover:text-slate-700"
      >
        <ArrowLeft className="size-3.5" /> {t('common.back')}
      </button>

      <Heading
        title={t('otp.title')}
        subtitle={
          <Trans
            i18nKey="otp.subtitle"
            values={{ phone: vm.displayPhone }}
            components={{ b: <span className="font-black text-slate-700" /> }}
          />
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          vm.verify()
        }}
      >
        <fieldset className="mb-6 flex justify-between gap-2 border-none p-0">
          <legend className="sr-only">{t('otp.title')}</legend>
          {vm.otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                vm.otpRefs.current[i] = el
              }}
              aria-label={t('otp.digit', { index: i + 1 })}
              value={digit}
              onChange={(e) => vm.changeOtpDigit(i, e.target.value)}
              onKeyDown={(e) => vm.otpKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              autoFocus={i === 0}
              className="h-14 w-full min-w-0 rounded-xl border-2 border-slate-200 bg-slate-50 text-center text-xl font-black text-slate-900 outline-none transition-all focus:border-primary focus:bg-white"
            />
          ))}
        </fieldset>

        {vm.error && (
          <div className="mb-6">
            <ErrorBox message={vm.error} />
          </div>
        )}

        <div className="mb-6 flex items-center justify-center">
          {vm.canResend ? (
            <button
              type="button"
              onClick={vm.resend}
              className="border-none bg-transparent text-sm font-bold text-primary hover:underline"
            >
              {t('otp.resend')}
            </button>
          ) : (
            <span
              aria-live="polite"
              className="rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-bold text-primary"
            >
              {vm.isSending ? <Loader2 className="inline size-4 animate-spin" /> : t('otp.resendIn', { time: vm.resendIn })}
            </span>
          )}
        </div>

        <button type="submit" disabled={!vm.canVerify} className={submitButton}>
          {vm.isVerifying && <Loader2 className="size-4 animate-spin" />}
          {t('otp.verify')}
        </button>
      </form>
    </>
  )
}

export function LoginForm({ vm }: { vm: LoginViewModel }) {
  const { t } = useLocale()
  return (
    <>
      {vm.step === 'phone' ? <PhoneStep vm={vm} /> : <OtpStep vm={vm} />}
      {DEMO && (
        <p className="mt-5 text-center text-[11px] font-medium text-slate-400">
          {t('otp.demoHint', { phone: DEMO.phone, code: DEMO.code })}
        </p>
      )}
    </>
  )
}
