import DynamoRepository from '@common/repository/DynamoRepository'
import IdeaService from '@common/services/IdeaService'
import { ApiGatewayEvent, successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { IdeaType } from '@common/models/Idea'
const {
  IDEAS_TABLE_NAME: TableName
} = process.env

const hello: ApiGatewayEvent<typeof schema> = async (event) => {

  const {
    body: {
      email,
      description,
      subject,
      type,
    }
  } = event

  const service = new IdeaService(new DynamoRepository({ TableName }))
  const idea = await service.createIdea(email, subject, description, type as IdeaType)

  return successResponse({
    idea,
  })
}

export const main = middyfy(hello)
