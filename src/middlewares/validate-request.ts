import { NextFunction, Request, Response } from 'express'
import AJV from 'ajv'
import keywords from 'ajv-keywords'

import { RequestValidationError } from '../errors/request-validation-error'
import { log } from '../libs/logger'

const ajv = keywords(new AJV({ allErrors: true, $data: true }))

interface IInputPayload {
  headers?: any
  query?: any
  params?: any
  body?: any
}

declare global {
  namespace Express {
    interface Request {
      payload?: IInputPayload
    }
  }
}

interface IMinAJVType {
  type: 'string' | 'array' | 'object' | 'boolean' | 'number' | 'integer' | 'null'
  [key: string]: any
}

interface ICommonSchema {
  type: IMinAJVType['type']
  properties: { [key: string]: IMinAJVType }
  additionalProperties?: boolean
  required?: string[]
}

export interface IValidatorInputSchema {
  headers?: ICommonSchema
  params?: ICommonSchema
  query?: ICommonSchema
  body?: ICommonSchema
}

const baseSchema = {
  type: 'object',
  properties: {},
  additionalProperties: false
}

/**
 * Refer http://json-schema.org/understanding-json-schema/UnderstandingJSONSchema.pdf to build proper schemas
 */
export const mValidateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  schema: IValidatorInputSchema,
  payload: IInputPayload
) => {
  log.info('MX Validator Validating :::', { path: req.path, schema, payload })

  const finalSchema = { ...baseSchema, required: Object.keys(schema), properties: { ...schema } }

  const isValid: boolean = await ajv.validate(finalSchema, payload)
  const valErrors = !isValid ? ajv.errors : []

  if (!!isValid) {
    req.payload = payload
    return next()
  }

  throw new RequestValidationError(valErrors as AJV.ErrorObject[])
}
