import { ApiGatewayEvent, successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'

const hello: ApiGatewayEvent<typeof schema> = async (event) => {
  return successResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  })
}

export const main = middyfy(hello)
