import { logMessage } from '@common/util/logger'
import { ApiGatewayResponse, errorResponse } from '@libs/api-gateway'
import { inspect } from 'util'
import CustomError from './CustomError'

export default function handleCatch(error: any): ApiGatewayResponse {
  if (error instanceof CustomError) return handleCustomError(error)
  if (error instanceof Error) return handleNodeError(error)

  // unknown error
  return handleUnknownError(error)
}

const handleCustomError = (error: CustomError): ApiGatewayResponse => {
  const errorMsg = error.toString()
  const stack = error.stack
  logMessage('Custom error handled', { errorMsg }, stack)
  return errorResponse(error.responseCode, error.message)
}

const handleNodeError = (error: Error): ApiGatewayResponse => {
  const { message, name } = error
  const stack = error.stack
  logMessage('Node error handled', { name, message }, stack)

  return errorResponse(500, message)
}

const handleUnknownError = (error: any): ApiGatewayResponse => {
  const errorStr = inspect(error)
  logMessage('Unknown error handled', { errorStr })

  return errorResponse(500, errorStr)
}
