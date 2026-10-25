import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupApiAuth } from '@/app/providers/auth'
import { i18n } from '@/shared/i18n'
import { server } from '@/mocks/server'
import { resetDb } from '@/mocks/db'
import { signIn, signOut } from './session'

beforeAll(async () => {
  server.listen({ onUnhandledFrame: 'error' })
  setupApiAuth()
  // Tests assert English copy; individual tests may switch language and are reset below.
  await i18n.changeLanguage('en')
})

// Every test starts signed in as the seeded maintainer; auth tests call signOut() first.
beforeEach(() => signIn())

afterEach(async () => {
  cleanup()
  await i18n.changeLanguage('en')
  server.resetHandlers()
  resetDb()
  signOut()
  localStorage.clear()
})

afterAll(() => server.close())

// jsdom lacks the pointer-capture and scroll APIs Radix Select calls when opening.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
