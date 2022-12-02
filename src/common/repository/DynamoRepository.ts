import dynamodb, { DynamoDbFilterExpression, DynamoDbFilterOperation, DynamoDbProp } from '@common/aws/dynamodb'
import Repository from './BaseRepository'

export interface DynamoDbClientRepoConfig {
  TableName: string
}

export interface DynamoDbPk {
  pk: DynamoDbProp,
  sk?: DynamoDbProp,
}

export interface DynamoDbUpdateOneDto {
  propsToUpdate: any[],
  key: DynamoDbPk
}

export interface DynamoDbFindByPkDto {
  key: DynamoDbPk
}

export interface DynamoDbFilterAllDto {
  key: DynamoDbPk
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

  async save(saveDto: object) {
    await dynamodb.putItem(this.clientConfig.TableName, saveDto)

    return saveDto
  }

  async findAll(filterAllDto: DynamoDbFilterAllDto): Promise<DynamoDbFilterAllResult> {
    const { Items, Count: count } = await dynamodb.queryItems(
      this.clientConfig.TableName,
      filterAllDto.key.pk,
      filterAllDto.key.sk,
      filterAllDto.skOperation,
      filterAllDto.filters,
    )

    const items = dynamodb.dynamoDbItemsToJsObjects(Items)

    return { items, count }
  }

  async findByPk(findByPkDto: DynamoDbFindByPkDto): Promise<object | null> {
    const { Item } = await dynamodb.getItem(this.clientConfig.TableName, findByPkDto.key.pk, findByPkDto.key.sk)

    if (!Item) return null

    const item = dynamodb.dynamoDbItemsToJsObjects([Item])[0]

    return item
  }

  async updateOne(updateOneDto: DynamoDbUpdateOneDto): Promise<boolean> {
    const propsToUpdate: DynamoDbProp[] = []

    for (const propName in updateOneDto.propsToUpdate) {
      propsToUpdate.push({
        name: propName,
        value: updateOneDto.propsToUpdate[propName],
      })
    }

    const resu = await dynamodb.updateItem(this.clientConfig.TableName, propsToUpdate, updateOneDto.key.pk, updateOneDto.key.sk)
    console.log('resu', resu)
    return true
  }
}
