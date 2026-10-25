import { authHandlers } from './auth'
import { resourceHandlers } from './resources'
import { shopRequestHandlers } from './shopRequests'

// resourceHandlers starts with the /admin/* auth guard, so it must come before the other admin handlers.
export const handlers = [...authHandlers, ...resourceHandlers, ...shopRequestHandlers]
