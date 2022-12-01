import type { AWS } from '@serverless/typescript';
import * as functions from '@functions/index';

// Resources
import Resources from './Resources'

const serverlessConfiguration: AWS = {
  service: 'iideass-be-dynamodb',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      IDEAS_TABLE_NAME: process.env.IDEAS_TABLE_NAME || '${env:IDEAS_TABLE_NAME}',
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
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: { Resources },
  functions,
};

module.exports = serverlessConfiguration;
