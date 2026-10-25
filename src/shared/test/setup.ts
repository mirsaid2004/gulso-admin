import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { i18n } from '@/shared/i18n'
import { server } from '@/mocks/server'
import { resetDb } from '@/mocks/db'

beforeAll(async () => {
  server.listen({ onUnhandledFrame: 'error' })
  // Tests assert English copy; individual tests may switch language and are reset below.
  await i18n.changeLanguage('en')
})
afterEach(async () => {
  cleanup()
  await i18n.changeLanguage('en')
  server.resetHandlers()
  resetDb()
})
afterAll(() => server.close())

// jsdom lacks the pointer-capture and scroll APIs Radix Select calls when opening.
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
