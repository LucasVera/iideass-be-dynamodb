import DynamoRepository from '@common/repository/DynamoRepository'
import IdeaService from '@common/services/IdeaService'
import { ApiGatewayEvent, successResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { IdeaType } from '@common/models/Idea'
import handleCatch from '@common/errors/handleCatch'
import { validateInput } from './validator'

const {
  IDEAS_TABLE_NAME: TableName
} = process.env

const updateIdea: ApiGatewayEvent<typeof schema> = async (event) => {
  try {
    validateInput(event.body)

    const {
      body: {
        email,
        description,
        subject,
        ideaType,
      }
    } = event

    const service = new IdeaService(new DynamoRepository({ TableName }))

    await service.findAndValidateIdeaExists(email, subject)

    const success = await service.updateIdea(email, subject, description, ideaType as IdeaType)

    return successResponse({
      success,
    })
  }
  catch (ex) {
    return handleCatch(ex)
  }
}

export const main = middyfy(updateIdea, { validateEmptyBody: true })
