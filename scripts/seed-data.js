const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
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

const client = new DynamoDBClient(clientConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

const seedData = async () => {
  console.log('Seeding test data...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = [
    {
      id: 'user-1',
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'user',
      profile: { age: 28, fitness_level: 'intermediate' },
      createdAt: new Date().toISOString()
    },
    {
      id: 'trainer-1',
      email: 'sarah@example.com',
      password: hashedPassword,
      name: 'Sarah Smith',
      role: 'trainer',
      profile: { specialties: ['yoga', 'pilates'], experience: 5 },
      createdAt: new Date().toISOString()
    },
    {
      id: 'trainer-2',
      email: 'mike@example.com',
      password: hashedPassword,
      name: 'Mike Johnson',
      role: 'trainer',
      profile: { specialties: ['strength', 'cardio'], experience: 8 },
      createdAt: new Date().toISOString()
    }
  ];

  // Create test events
  const events = [
    {
      id: 'event-1',
      title: 'Morning Yoga',
      description: 'Relaxing yoga session to start your day',
      trainer: 'trainer-1',
      date: '2024-01-15',
      time: '08:00',
      duration: 60,
      capacity: 10,
      price: 25,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-2',
      title: 'HIIT Training',
      description: 'High-intensity interval training',
      trainer: 'trainer-2',
      date: '2024-01-16',
      time: '18:00',
      duration: 45,
      capacity: 8,
      price: 35,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  // Create test bookings
  const bookings = [
    {
      id: 'booking-1',
      user: 'user-1',
      event: 'event-1',
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'First time booking',
      createdAt: new Date().toISOString()
    }
  ];

  // Create test messages
  const messages = [
    {
      id: 'message-1',
      sender: 'user-1',
      recipient: 'trainer-1',
      content: 'Hi, I have a question about the yoga class',
      roomId: 'user-1_trainer-1',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'message-2',
      sender: 'trainer-1',
      recipient: 'user-1',
      content: 'Sure! What would you like to know?',
      roomId: 'user-1_trainer-1',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];

  // Insert data
  const tables = [
    { data: users, tableName: 'MBoxFitness-Users', name: 'Users' },
    { data: events, tableName: 'MBoxFitness-Events', name: 'Events' },
    { data: bookings, tableName: 'MBoxFitness-Bookings', name: 'Bookings' },
    { data: messages, tableName: 'MBoxFitness-Messages', name: 'Messages' }
  ];

  for (const { data, tableName, name } of tables) {
    for (const item of data) {
      try {
        await dynamodb.send(new PutCommand({
          TableName: tableName,
          Item: item
        }));
      } catch (error) {
        console.error(`Error inserting ${name} data:`, error);
      }
    }
    console.log(`${name} test data inserted (${data.length} items)`);
  }

  console.log('Test data seeding complete!');
};

seedData().catch(console.error);