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

### Local Development (with Docker)
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Setup local DynamoDB + test data
./scripts/setup-local.sh

# Start development server
npm run dev
```

### Production
```bash
# Setup AWS DynamoDB
node scripts/create-tables.js

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
DYNAMODB_LOCAL=true
```

## Local Development

- **DynamoDB Local**: http://localhost:8000
- **DynamoDB Admin**: http://localhost:8001
- **API Server**: http://localhost:3000

### Test Accounts
- User: `john@example.com` / `password123`
- Trainer: `sarah@example.com` / `password123`
- Trainer: `mike@example.com` / `password123`

## AWS Setup

1. Create AWS account (free tier)
2. Get AWS credentials from IAM
3. Set `DYNAMODB_LOCAL=false` in .env
4. Create DynamoDB tables:
   ```bash
   node scripts/create-tables.js
   ```

## API Examples

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (requires token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Users
```bash
# Get all trainers
curl -X GET http://localhost:3000/api/users/trainers/list

# Get user profile
curl -X GET http://localhost:3000/api/users/trainer-1
```

### Events
```bash
# Get all events
curl -X GET http://localhost:3000/api/events

# Get trainer's events (requires auth)
curl -X GET http://localhost:3000/api/events/my-events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Bookings
```bash
# Get user bookings (requires auth)
curl -X GET http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get event bookings
curl -X GET http://localhost:3000/api/bookings/event/event-1
```

### Messages
```bash
# Get conversations (requires auth)
curl -X GET http://localhost:3000/api/messages/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get conversation with user
curl -X GET http://localhost:3000/api/messages/conversation/trainer-1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Socket.io Events

- `join_room` - Join message room
- `send_message` - Send real-time message
- `receive_message` - Receive real-time message

## Scripts

- `./scripts/setup-local.sh` - Setup local DynamoDB + test data
- `./scripts/reset-local.sh` - Reset local environment
- `node scripts/create-tables.js` - Create tables only
- `node scripts/seed-data.js` - Load test data only