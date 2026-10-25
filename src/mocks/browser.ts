import { setupWorker } from 'msw/browser'
import { enableSessionPersistence } from './db'
import { handlers } from './handlers'

enableSessionPersistence()

export const worker = setupWorker(...handlers)
