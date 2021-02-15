import { Request, Response, NextFunction } from 'express'
import { getNamespace } from 'continuation-local-storage'

import { log } from '../libs/logger'
import { CustomError } from '../errors/custom-error'
import { ClsConstants } from '../constants/cls-constants'

/**
 * Error handler middleware. Use this AFTER all you other routes and middlewares are used.
 * This shall always send back a consistent looking error response.
 */
export const mErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error(`----- Error caught by Error Handler: -----`, err)

  const ns = getNamespace(ClsConstants.Namespace) || { get: () => '' }
  const requestId = ns.get(ClsConstants.CorrelationId) || ''

  if (err instanceof CustomError) return res.status(err.statusCode).send({ requestId, errors: err.serializeErrors() })

  return res.status(500).send({ requestId, errors: [{ message: 'Something went wrong' }] })
}
