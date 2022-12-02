import { inspect } from 'util'

enum ErrorTypes {
  UNKNOWN = 'Unknown_Error',
  INVALID_INPUT = 'Invalid_input',
  NOT_FOUND = 'Not_Found',
}

export default abstract class CustomError extends Error {
  type: ErrorTypes
  responseCode: number
  additionalData: object

  constructor(message: string, additionalData = {}) {
    super(message)
    this.additionalData = additionalData

    Error.captureStackTrace(this, this.constructor)
  }

  toString(): string {
    return inspect({
      type: this.type,
      responseCode: this.responseCode,
      message: this.message,
      additionalData: this.additionalData,
    })
  }
}

export class ServerError extends CustomError {
  constructor(message: string, additionalData = {}) {
    super(message, additionalData)
    this.type = ErrorTypes.UNKNOWN
    this.responseCode = 500
  }
}

export class BadInputError extends CustomError {
  constructor(message: string, additionalData = {}) {
    super(message, additionalData)
    this.type = ErrorTypes.INVALID_INPUT
    this.responseCode = 400
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, additionalData = {}) {
    super(message, additionalData)
    this.type = ErrorTypes.NOT_FOUND
    this.responseCode = 404
  }
}
