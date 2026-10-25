import { useRef, useState, type KeyboardEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi, useSessionStore, type AuthResponse } from '@/entities/session'
import { useLocale } from '@/shared/i18n'
import { loginErrorKey, type LoginErrorKey } from '../lib/errors'
import { emptyOtp, fillOtp, formatCountdown, isOtpComplete, OTP_LENGTH, RESEND_SECONDS } from '../lib/otp'
import { formatPhoneInput, isPhoneComplete, toInternational } from '../lib/phone'
import { useCountdown } from './useCountdown'

type Step = 'phone' | 'otp'

/** Phone → SMS code → session. `onSuccess` runs after the session is stored. */
export function useLoginViewModel({ onSuccess }: { onSuccess?: (auth: AuthResponse) => void } = {}) {
  const { t } = useLocale()
  const setSession = useSessionStore((s) => s.setSession)

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(emptyOtp)
  const [errorKey, setErrorKey] = useState<LoginErrorKey | null>(null)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])
  const countdown = useCountdown(RESEND_SECONDS, step === 'otp')

  const focusBox = (index: number) => otpRefs.current[index]?.focus()
  const resetOtp = () => {
    setOtp(emptyOtp())
    focusBox(0)
  }

  const sendMutation = useMutation({
    mutationFn: () => authApi.sendOtp(toInternational(phone)),
    onMutate: () => setErrorKey(null),
    onSuccess: () => {
      setStep('otp')
      setOtp(emptyOtp())
      countdown.restart()
    },
    onError: (e) => setErrorKey(loginErrorKey(e)),
  })

  const verifyMutation = useMutation({
    mutationFn: (code: string) => authApi.verifyOtp(toInternational(phone), code),
    onMutate: () => setErrorKey(null),
    onSuccess: (auth) => {
      setSession(auth)
      onSuccess?.(auth)
    },
    onError: (e) => {
      setErrorKey(loginErrorKey(e))
      resetOtp()
    },
  })

  const canSend = isPhoneComplete(phone) && !sendMutation.isPending
  const canVerify = isOtpComplete(otp) && !verifyMutation.isPending

  return {
    step,
    error: errorKey ? t(`login.errors.${errorKey}`) : null,

    phone,
    displayPhone: `+998 ${phone}`,
    changePhone: (value: string) => {
      setPhone(formatPhoneInput(value))
      setErrorKey(null)
    },
    canSend,
    isSending: sendMutation.isPending,
    sendCode: () => canSend && sendMutation.mutate(),

    otp,
    otpRefs,
    changeOtpDigit: (index: number, value: string) => {
      const result = fillOtp(otp, index, value)
      setOtp(result.otp)
      if (value) focusBox(result.focus)
    },
    otpKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        e.preventDefault()
        setOtp((prev) => prev.map((d, i) => (i === index - 1 ? '' : d)))
        focusBox(index - 1)
      }
    },
    canVerify,
    isVerifying: verifyMutation.isPending,
    verify: () => canVerify && verifyMutation.mutate(otp.join('')),

    canResend: countdown.done && !sendMutation.isPending,
    resendIn: formatCountdown(countdown.left),
    resend: () => {
      if (!countdown.done) return
      sendMutation.mutate(undefined, { onSuccess: () => focusBox(0) })
    },
    back: () => {
      setStep('phone')
      setErrorKey(null)
      setOtp(emptyOtp())
    },
    otpLength: OTP_LENGTH,
  }
}

export type LoginViewModel = ReturnType<typeof useLoginViewModel>
