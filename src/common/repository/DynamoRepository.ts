import dynamodb from '@common/aws/dynamodb'
import Repository from './BaseRepository'

export interface DynamoDbClientRepoConfig {
  TableName: string
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
}
