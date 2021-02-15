import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      currentUser?: any
    }
  }
}

/**
 * A middleware generator
 * @param jwtSecret The secret used to sign the JWT
 * @returns A middleware that appends the JWT verified currentUser Object to *req*
 */
export const mAppendCurrentUser = (jwtSecret: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) return next()

  try {
    const payload = jwt.verify(req.session.jwt, jwtSecret)
    req.currentUser = payload
  } catch (e) {
    console.error('JWT Verification failed', e)
  }
  next()
}
