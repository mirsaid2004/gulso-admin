import { resourceHandlers } from './resources'
import { shopRequestHandlers } from './shopRequests'

export const handlers = [...shopRequestHandlers, ...resourceHandlers]
