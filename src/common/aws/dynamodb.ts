import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { logMessage } from '@common/util/logger'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
})

const putItem = (TableName: string, jsItem: object): Promise<PutItemCommandOutput> => {
  const input: PutItemCommandInput = {
    TableName,
    Item: objToDynamoItem(jsItem),
  }
  const command = new PutItemCommand(input)
  return client.send(command)
}

interface DynamoDbTypeFormat {
  type: string
  prop: string
}
const availableTypes: DynamoDbTypeFormat[] = [
  { type: 'string', prop: 'S' },
  { type: 'number', prop: 'N' },
  { type: 'boolean', prop: 'BOOL' },
]
const objToDynamoItem = (obj: object) => {
  const dynamoItem = {} as any
  for (const key in obj) {
    const value = obj[key]
    const { type, prop } = availableTypes.find(({ type }) => typeof value === type)
    if (!type) {
      logMessage('Type not supported for conversion to dynamodb', { key, value, type })
      // (TODO): throw error?
      continue
    }

    dynamoItem[key] = {
      [prop]: value.toString ? value.toString() : value,
    }
  }

  return dynamoItem
}

export default {
  putItem,
}
