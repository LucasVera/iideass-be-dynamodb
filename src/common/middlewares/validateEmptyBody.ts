import handleCatch from '@common/errors/handleCatch'
import { logMessage } from '@common/util/logger'
import { validateRequiredProp } from '@common/util/validations'
import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * Validate body is not empty
 */
export const validateEmptyBodyMiddleware = () => ({
  before: async (handler) => {
    try {
      const { body } = handler.event as APIGatewayProxyEvent
      validateRequiredProp(body, 'Body cannot be empty')
    } catch (ex) {
      logMessage('Empty body received')
      return handleCatch(ex)
    }
  },
})
