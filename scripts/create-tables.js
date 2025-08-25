const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

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

const dynamodb = new DynamoDBClient(clientConfig);

const createTables = async () => {
  // Users table
  const usersTable = {
    TableName: 'MBoxFitness-Users',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  };

  const eventsTable = {
    TableName: 'MBoxFitness-Events',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  };

  const bookingsTable = {
    TableName: 'MBoxFitness-Bookings',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  };

  const messagesTable = {
    TableName: 'MBoxFitness-Messages',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  };

  const hikesTable = {
    TableName: 'MBoxFitness-Hikes',
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  };

  const tables = [
    { table: usersTable, name: 'Users' },
    { table: eventsTable, name: 'Events' },
    { table: bookingsTable, name: 'Bookings' },
    { table: messagesTable, name: 'Messages' },
    { table: hikesTable, name: 'Hikes' }
  ];

  for (const { table, name } of tables) {
    try {
      await dynamodb.send(new CreateTableCommand(table));
      console.log(`${name} table created successfully`);
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log(`${name} table already exists`);
      } else {
        console.error(`Error creating ${name} table:`, error);
      }
    }
  }
};

createTables();