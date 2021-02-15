import { ErrorObject } from 'ajv'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
  statusCode = 400

  constructor(public errors: ErrorObject[]) {
    super('Invalid request parameters')
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    const formattedErrors = this.errors.map(({ message = 'Invalid', dataPath, ...rest }) => ({
      message,
      field: dataPath,
      ...rest
    }))
    return formattedErrors
  }
}
