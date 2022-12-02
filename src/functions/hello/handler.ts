import dynamodb from '@common/aws/dynamodb'
import { ApiGatewayEvent, successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'

const hello: ApiGatewayEvent<typeof schema> = async (event) => {
  await dynamodb.putItem('IdeasTableDev', {
    email: 'test@test.com',
    subject: `best-${Math.round(Math.random() * 100).toString()}`,
    someotherkey: 234,
    booVal: true,
  })

  return successResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  })
}

export const main = middyfy(hello)
