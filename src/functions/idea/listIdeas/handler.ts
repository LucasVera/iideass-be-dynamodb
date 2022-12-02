import DynamoRepository from '@common/repository/DynamoRepository'
import IdeaService from '@common/services/IdeaService'
import { successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import handleCatch from '@common/errors/handleCatch'
import { validateInput } from './validator'
import { APIGatewayEvent } from 'aws-lambda'

const {
  IDEAS_TABLE_NAME: TableName
} = process.env

const listUserIdeas = async (event: APIGatewayEvent) => {
  try {
    validateInput(event.queryStringParameters)

    const { email } = event.queryStringParameters

    const service = new IdeaService(new DynamoRepository({ TableName }))
    const { ideas, count } = await service.findUserIdeas(email)

    return successResponse({
      count,
      ideas,
    })
  }
  catch (ex) {
    return handleCatch(ex)
  }
}

export const main = middyfy(listUserIdeas, { validateEmptyQueryString: true })
