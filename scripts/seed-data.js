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
      name: 'Boxing Bootcamp Challenge',
      title: 'Boxing Bootcamp Challenge',
      description: 'Intense boxing workout challenge',
      location: 'Main Gym Floor',
      trainer: 'trainer-2',
      date: '2024-01-20',
      time: '10:00',
      duration: 90,
      capacity: 15,
      price: 45,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-2',
      name: 'Fitness Competition',
      title: 'Fitness Competition',
      description: 'Competitive fitness challenge event',
      location: 'Outdoor Arena',
      trainer: 'trainer-2',
      date: '2024-01-25',
      time: '14:00',
      duration: 120,
      capacity: 20,
      price: 50,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-3',
      name: 'Nutrition Workshop',
      title: 'Nutrition Workshop',
      description: 'Learn about proper nutrition for fitness',
      location: 'Conference Room A',
      trainer: 'trainer-1',
      date: '2024-02-01',
      time: '18:00',
      duration: 60,
      capacity: 25,
      price: 20,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-4',
      name: 'Team Building Workout',
      title: 'Team Building Workout',
      description: 'Fun team-based fitness activities',
      location: 'Main Gym Floor',
      trainer: 'trainer-1',
      date: '2024-02-08',
      time: '09:00',
      duration: 75,
      capacity: 12,
      price: 30,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-5',
      name: 'Charity Fitness Run',
      title: 'Charity Fitness Run',
      description: 'Charity run for a good cause',
      location: 'Central Park',
      trainer: 'trainer-2',
      date: '2024-02-15',
      time: '08:00',
      duration: 60,
      capacity: 50,
      price: 15,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'event-6',
      name: 'Advanced Boxing Seminar',
      title: 'Advanced Boxing Seminar',
      description: 'Advanced boxing techniques and training',
      location: 'Training Room B',
      trainer: 'trainer-2',
      date: '2024-02-22',
      time: '11:00',
      duration: 90,
      capacity: 10,
      price: 60,
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
      notes: 'Excited for the boxing challenge!',
      createdAt: new Date().toISOString()
    },
    {
      id: 'booking-2',
      user: 'user-1',
      event: 'event-3',
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Looking forward to learning about nutrition',
      createdAt: new Date().toISOString()
    }
  ];

  // Create test messages/notifications
  const messages = [
    {
      id: 'message-1',
      sender: 'trainer-2',
      recipient: 'user-1',
      title: 'Booking Confirmed',
      content: 'Your booking for Boxing Bootcamp Challenge has been confirmed!',
      type: 'booking_confirmation',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'message-2',
      sender: 'trainer-1',
      recipient: 'user-1',
      title: 'Workshop Reminder',
      content: 'Don\'t forget about the Nutrition Workshop tomorrow at 6:00 PM. Please bring a notebook!',
      type: 'reminder',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'message-3',
      sender: 'trainer-2',
      recipient: 'user-1',
      title: 'Event Update',
      content: 'The Boxing Bootcamp Challenge location has been updated to Main Gym Floor.',
      type: 'event_update',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'message-4',
      sender: 'trainer-1',
      recipient: 'user-1',
      title: 'Welcome Message',
      content: 'Welcome to MBoxFitness! We\'re excited to have you join our community.',
      type: 'welcome',
      read: false,
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
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