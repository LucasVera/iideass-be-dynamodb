import dynamodb, { DynamoDbFilterExpression, DynamoDbFilterOperation, DynamoDbProp } from '@common/aws/dynamodb'
import Repository from './BaseRepository'

export interface DynamoDbClientRepoConfig {
  TableName: string
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

    return dto
  }

  async findAll(filterDto: DynamoDbFilterAllDto): Promise<DynamoDbFilterAllResult> {
    const { Items, Count: count } = await dynamodb.queryItems(
      this.clientConfig.TableName,
      filterDto.pk,
      filterDto.sk,
      filterDto.skOperation,
      filterDto.filters,
    )

    const items = dynamodb.dynamoDbItemsToJsObjects(Items)

    return { items, count }
  }
}
