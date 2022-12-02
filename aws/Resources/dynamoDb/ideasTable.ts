export default {
  IdeasDynamodbTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      AttributeDefinitions: [
        {
          AttributeName: 'email',
          AttributeType: 'S',
        },
        {
          AttributeName: 'subject',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'email',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'subject',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: process.env.IDEAS_TABLE_READ_CAPACITY, // setup in pipeline only - not taken into the app
        WriteCapacityUnits: process.env.IDEAS_TABLE_WRITE_CAPACITY, // setup in pipeline only - not taken into the app
      },
      TableName: process.env.IDEAS_TABLE_NAME,
    },
  },
}
