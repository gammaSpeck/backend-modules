import { Response } from 'express'

type SuccessCodes = 200 | 201 | 204

interface ICustomResponse {
  res: Response
  data?: any
  msg?: string
  code?: SuccessCodes
}

/**
 * Static class for sending back all Success responses with a data and message in the res.body
 */
export abstract class CustomResponse {
  static send({ res, data = null, msg = 'Success', code = 200 }: ICustomResponse) {
    res.status(code).send({ msg, data })
  }
}
