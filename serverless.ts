import type { AWS } from '@serverless/typescript'
import * as functions from '@functions/index'

// Resources
import Resources from './aws/Resources'

const serverlessConfiguration: AWS = {
  service: 'iideass-be-dynamodb',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      NODE_ENV: process.env.NODE_ENV || 'production',
      IDEAS_TABLE_NAME: process.env.IDEAS_TABLE_NAME || '${env:IDEAS_TABLE_NAME}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:List*',
              'dynamodb:BatchGet*',
              'dynamodb:DescribeStream',
              'dynamodb:DescribeTable',
              'dynamodb:Get*',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:BatchWrite*',
              'dynamodb:CreateTable',
              'dynamodb:Delete*',
              'dynamodb:Update*',
              'dynamodb:PutItem',
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: { Resources },
  functions,
}

module.exports = serverlessConfiguration
