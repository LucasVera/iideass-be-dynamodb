import DynamoRepository from '@common/repository/DynamoRepository'
import IdeaService from '@common/services/IdeaService'
import { successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import handleCatch from '@common/errors/handleCatch'
import { validateInput } from './validator'
import { APIGatewayEvent } from 'aws-lambda'

const { IDEAS_TABLE_NAME: TableName } = process.env

const deleteIdea = async (event: APIGatewayEvent) => {
  try {
    validateInput(event.queryStringParameters)

    const { email, subject } = event.queryStringParameters

    const service = new IdeaService(new DynamoRepository({ TableName }))

    const dbIdea = await service.findAndValidateIdeaExists(email, subject)

    const deleteAtTimestamp = await service.deleteIdea(dbIdea)

    return successResponse({
      deleteAtTimestamp,
    })
  } catch (ex) {
    return handleCatch(ex)
  }
}

export const main = middyfy(deleteIdea, { validateEmptyQueryString: true })
