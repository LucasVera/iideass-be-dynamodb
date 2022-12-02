import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { logMessage } from '@common/util/logger'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
})

const putItem = async (TableName: string, jsItem: object): Promise<PutItemCommandOutput> => {
  const input: PutItemCommandInput = {
    TableName,
    Item: objToDynamoItem(jsItem),
  }
  const command = new PutItemCommand(input)
  const prom = await client.send(command)
  return prom
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
    const typeFound = availableTypes.find(({ type }) => typeof value === type)
    if (!typeFound || !typeFound.type) {
      logMessage('Type not supported for conversion to dynamodb', { key, value, typeFound })
      // (TODO): throw error?
      continue
    }
    const { prop } = typeFound

    dynamoItem[key] = {
      [prop]: value.toString ? value.toString() : value,
    }
  }

  return dynamoItem
}

export default {
  putItem,
}
