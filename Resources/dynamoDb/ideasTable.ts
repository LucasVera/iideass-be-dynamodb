export default {
  IdeasDynamodbTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      AttributeDefinitions: [
        {
          AttributeName: 'email',
          AttributeType: 'S'
        },
        {
          AttributeName: 'subject',
          AttributeType: 'S'
        },
      ],
      KeySchema: [
        {
          AttributeName: 'email',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'subject',
          KeyType: 'RANGE'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      },
      TableName: '${env:IDEAS_TABLE_NAME}'
    }
  }
}
