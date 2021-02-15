import { createLogger, transports, format, Logger } from 'winston'
import { getNamespace } from 'continuation-local-storage'

import safeStringify from 'json-stringify-safe'
import { serializeError } from 'serialize-error'

import { ClsConstants } from '../constants/cls-constants'

const { combine, timestamp, printf, colorize, errors } = format

interface ILogger {
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, error: Error, data?: any): void
}

const bufferSerializer = (k: string, v: any) => (v && v.type === 'Buffer' && Array.isArray(v.data) ? '[Buffer]' : v)
const stringify = (obj: any) => safeStringify(obj, bufferSerializer)

const defaultLogTransport = [new transports.Console()]

const logFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf((log) => {
    const ns = getNamespace(ClsConstants.Namespace) || { get: () => '' }
    const correlationId = ns.get(ClsConstants.CorrelationId) || ''
    const errorLog = log.error ? `, "error": ${stringify(serializeError(log.error))}` : ''

    return `${log.timestamp} ${correlationId}  { "level": "${log.level}", "message": "${
      log.message
    }", "data": ${stringify(log.data)}${errorLog} }`
  })
)

const DefaultLogger = createLogger({ transports: [...defaultLogTransport], format: logFormat })

/**
 * Custom Logger Object with easy to use log levels
 */
export const log = {
  info: (message: string, data?: any) => {
    const { info: log } = DefaultLogger
    log({ message, data })
  },

  warn: (message: string, data?: any) => {
    const { warn: log } = DefaultLogger
    log({ message, data })
  },

  error: (message: string, error: Error, data?: any) => {
    const { error: log } = DefaultLogger
    log({ message, error, data })
  }
}
