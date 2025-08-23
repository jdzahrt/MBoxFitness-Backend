# MBoxFitness Backend

Backend service for the MBoxFitness React Native app, providing authentication, user management, event booking, and real-time messaging.

## Features

- JWT Authentication & Authorization
- User profiles (users & trainers)
- Event management & bookings
- Real-time messaging with Socket.io
- RESTful API endpoints

## Tech Stack

- Node.js & Express
- AWS DynamoDB (Free Tier)
- JWT for authentication
- Socket.io for real-time messaging
- bcryptjs for password hashing

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## AWS Setup

1. Create AWS account (free tier)
2. Get AWS credentials from IAM
3. Create DynamoDB tables:
   ```bash
   node scripts/create-tables.js
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/trainers/list` - Get all trainers

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (trainers only)
- `GET /api/events/my-events` - Get trainer's events
- `PUT /api/events/:id` - Update event

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/event/:eventId` - Get event bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `PUT /api/messages/read/:roomId` - Mark messages as read

## Socket.io Events

- `join_room` - Join message room
- `send_message` - Send real-time message
- `receive_message` - Receive real-time message