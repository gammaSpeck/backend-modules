import { Request, Response, NextFunction } from 'express'
import { NotAuthorizedError } from '../errors/not-authorized-error'

/**
 * Middleware that checks for the currentUser object on *req* property.
 * If not present, throws the NotAuthorizedError
 */
export const mRequireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) throw new NotAuthorizedError()
  next()
}
