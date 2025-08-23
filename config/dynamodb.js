const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const isLocal = process.env.NODE_ENV === 'development' && process.env.DYNAMODB_LOCAL === 'true';

const clientConfig = {
  region: process.env.AWS_REGION || 'us-east-1'
};

if (isLocal) {
  clientConfig.endpoint = 'http://localhost:8000';
  clientConfig.credentials = {
    accessKeyId: 'local',
    secretAccessKey: 'local'
  };
} else {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

const client = new DynamoDBClient(clientConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports = dynamodb;