import { Request, Response, NextFunction } from 'express'
import { createNamespace } from 'continuation-local-storage'
import { v4 as uuid } from 'uuid'

import { ClsConstants } from '../constants/cls-constants'

const ns = createNamespace(ClsConstants.Namespace)

/**  Should be initialized first in the express app.. */

/**
 * Express middleware that sets up the CLS for every request to have a unique request ID.
 * Should be *use-d* in the beginning in the express app.
 */
export const mLogRequest = (req: Request, res: Response, next: NextFunction) => {
  ns.run(() => {
    ns.set(ClsConstants.CorrelationId, uuid())
    next()
  })
}
