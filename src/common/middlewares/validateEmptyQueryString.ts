import handleCatch from '@common/errors/handleCatch'
import { logMessage } from '@common/util/logger'
import { validateRequiredProp } from '@common/util/validations'
import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * Validate query string is not empty
 */
export const validateEmptyQueryStringMiddleware = () => ({
  before: async (handler) => {
    try {
      const { queryStringParameters } = handler.event as APIGatewayProxyEvent
      validateRequiredProp(queryStringParameters, 'Query string is required.')
    } catch (ex) {
      logMessage('Empty query received')
      return handleCatch(ex)
    }
  },
})
