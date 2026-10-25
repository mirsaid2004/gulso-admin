import { useEffect, useState } from 'react'

const secondsUntil = (deadline: number) => Math.max(0, Math.ceil((deadline - Date.now()) / 1000))

/**
 * Seconds left until a deadline `seconds` from the last `restart()`. Derived from the
 * clock rather than counting ticks, so it stays right when timers are throttled
 * (background tabs). Doesn't tick while `active` is false.
 */
export function useCountdown(seconds: number, active: boolean) {
  const [deadline, setDeadline] = useState(() => Date.now() + seconds * 1000)
  const [, rerender] = useState(0)
  const left = secondsUntil(deadline)

  // Re-render once a second while running; the interval only restarts when it starts or stops.
  const running = active && left > 0
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => rerender((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  return { left, done: left <= 0, restart: () => setDeadline(Date.now() + seconds * 1000) }
}
