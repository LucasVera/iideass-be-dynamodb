import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb'
import { logMessage } from '@common/util/logger'

export enum DynamoDbFilterOperation {
  CONTAINS = 'contains',
  BEGINS_WITH = 'begins_with',
  EQUALS = '=',
  LESS = '<',
  LESS_OR_EQUAL = '<=',
  GREATER = '>',
  GREATER_OR_EQUAL = '>=',
}
export interface DynamoDbProp {
  name: string
  value: string
}
export interface DynamoDbFilterExpression {
  operation: DynamoDbFilterOperation
  prop: DynamoDbProp
}
interface DynamoDbTypeFormat {
  type: string
  dynamoDbPropType: string
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
})

const getItem = (
  TableName: string,
  primaryKey: DynamoDbProp,
  sortKey?: DynamoDbProp,
): Promise<GetItemCommandOutput> => {
  const Key = { [primaryKey.name]: getDynamoDbFormattedProp(primaryKey.value) }
  if (sortKey) Key[sortKey.name] = getDynamoDbFormattedProp(sortKey.value)
  const input: GetItemCommandInput = {
    TableName,
    Key,
  }

  const command = new GetItemCommand(input)

  return client.send(command)
}

const queryItems = async (
  TableName: string,
  primaryKey: DynamoDbProp,
  sortKey?: DynamoDbProp,
  sortKeyOperation?: DynamoDbFilterOperation,
  filters?: DynamoDbFilterExpression[]
): Promise<QueryCommandOutput> => {
  let KeyConditionExpression = `${primaryKey.name} = :pk`
  const ExpressionAttributeValues: any = { ':pk': getDynamoDbFormattedProp(primaryKey.value) }
  if (sortKey && sortKeyOperation) {
    KeyConditionExpression += ` and ${sortKey.name} ${sortKeyOperation} :sk`
    ExpressionAttributeValues['sk'] = getDynamoDbFormattedProp(sortKey.value)
  }

  let FilterExpression = ''
  if (Array.isArray(filters) && filters.length > 0) {
    filters.forEach(({ operation, prop }) => {
      if (operation === DynamoDbFilterOperation.BEGINS_WITH || operation === DynamoDbFilterOperation.CONTAINS) {
        FilterExpression += ` ${operation} (${prop.name}, :${prop.name})`
      }
      else {
        FilterExpression += `${prop.name} ${operation} :${prop.name}`
      }
      ExpressionAttributeValues[`:${prop.name}`] = getDynamoDbFormattedProp(prop.value)
    })
  }

  const input: QueryCommandInput = {
    TableName,
    KeyConditionExpression,
    FilterExpression,
    ExpressionAttributeValues,
  }
  if (!FilterExpression) delete input.FilterExpression
  const command = new QueryCommand(input)

  return client.send(command)
}

const putItem = (TableName: string, jsItem: object): Promise<PutItemCommandOutput> => {
  const input: PutItemCommandInput = {
    TableName,
    Item: objToDynamoItem(jsItem),
  }
  const command = new PutItemCommand(input)

  return client.send(command)
}

const availableTypes: DynamoDbTypeFormat[] = [
  { type: 'string', dynamoDbPropType: 'S' },
  { type: 'number', dynamoDbPropType: 'N' },
  { type: 'boolean', dynamoDbPropType: 'BOOL' },
]
const objToDynamoItem = (obj: object) => {
  const dynamoItem = {} as any
  for (const key in obj) {
    const value = obj[key]
    const dynamoDbProp = getDynamoDbFormattedProp(value)
    if (!dynamoDbProp) continue
    dynamoItem[key] = dynamoDbProp
  }

  return dynamoItem
}

const getDynamoDbFormattedProp = (value: any): any => {
  const typeFound = availableTypes.find(({ type }) => typeof value === type)
  if (!typeFound || !typeFound.type) {
    logMessage('Type not supported for conversion to dynamodb', { value, typeFound })
    return null
  }
  const { dynamoDbPropType } = typeFound

  if (!dynamoDbPropType) return null

  return { [dynamoDbPropType]: value.toString ? value.toString() : value }
}

const getJsPropFromDynamoDbProp = (dynamoDbProp: object): any => {
  const dynamoDbType = Object.keys(dynamoDbProp)[0]
  const propValueStr = dynamoDbProp[dynamoDbType]
  const typeFound = availableTypes.find(({ dynamoDbPropType }) => dynamoDbPropType === dynamoDbType)
  if (!typeFound || !typeFound.type) {
    logMessage('Type not supported for conversion from dynamodb', { dynamoDbProp, dynamoDbType, propValue: propValueStr })
    return null
  }
  const { type } = typeFound

  if (type === 'string') return propValueStr
  if (type === 'number') return Number(propValueStr)
  return !!propValueStr
}

const dynamoDbItemsToJsObjects = (Items: any[]): object[] => Items.map(Item => {
  const propNames = Object.keys(Item)
  const resultObj = {}
  propNames.forEach(propName => {
    const dynamoDbProp = Item[propName]
    const propValue = getJsPropFromDynamoDbProp(dynamoDbProp)
    resultObj[propName] = propValue
  })

  return resultObj
})


export default {
  putItem,
  getItem,
  queryItems,
  dynamoDbItemsToJsObjects,
}
