import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts down to zero while active', () => {
    const { result } = renderHook(() => useCountdown(3, true))
    expect(result.current).toMatchObject({ left: 3, done: false })

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.left).toBe(2)

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current).toMatchObject({ left: 0, done: true })
  })

  it('stays correct when a timer fires late (throttled tab)', () => {
    const { result } = renderHook(() => useCountdown(59, true))

    act(() => {
      vi.setSystemTime(Date.now() + 40_000) // clock jumps without ticks firing
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.left).toBe(18)
  })

  it('restarts from the full duration', () => {
    const { result } = renderHook(() => useCountdown(5, true))
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.done).toBe(true)

    act(() => result.current.restart())
    expect(result.current.left).toBe(5)
  })
})
