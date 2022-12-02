import dynamodb, { DynamoDbFilterExpression, DynamoDbFilterOperation, DynamoDbProp } from '@common/aws/dynamodb'
import Repository from './BaseRepository'

export interface DynamoDbClientRepoConfig {
  TableName: string
}

export interface DynamoDbFindByPkDto {
  pk: DynamoDbProp
  sk: DynamoDbProp
}

export interface DynamoDbFilterAllDto {
  pk: DynamoDbProp
  sk?: DynamoDbProp
  skOperation?: DynamoDbFilterOperation

  filters?: DynamoDbFilterExpression[]
}

export interface DynamoDbFilterAllResult {
  items: any[]
  count: number
}

export default class DynamoRepository extends Repository {
  clientConfig: DynamoDbClientRepoConfig

  constructor(config: DynamoDbClientRepoConfig) {
    super()
    this.clientConfig = config
  }

  async save(dto: object) {
    await dynamodb.putItem(this.clientConfig.TableName, dto)
    console.log('success?')

    return dto
  }

  async findAll(filterAllDto: DynamoDbFilterAllDto): Promise<DynamoDbFilterAllResult> {
    const { Items, Count: count } = await dynamodb.queryItems(
      this.clientConfig.TableName,
      filterAllDto.pk,
      filterAllDto.sk,
      filterAllDto.skOperation,
      filterAllDto.filters,
    )

    const items = dynamodb.dynamoDbItemsToJsObjects(Items)

    return { items, count }
  }

  async findByPk(findByPkDto: DynamoDbFindByPkDto): Promise<object | null> {
    const { Item } = await dynamodb.getItem(this.clientConfig.TableName, findByPkDto.pk, findByPkDto.sk)

    if (!Item) return null

    const item = dynamodb.dynamoDbItemsToJsObjects([Item])[0]

    return item
  }
}
