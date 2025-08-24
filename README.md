# MBoxFitness Backend

Backend service for the MBoxFitness React Native app, providing authentication, user management, event booking, and real-time messaging.

🌐 **Live API**: https://mboxfitness-backend.vercel.app

## Features

- JWT Authentication & Authorization
- User profiles (users & trainers)
- Event management & bookings
- RESTful API endpoints
- Health monitoring endpoint

## Tech Stack

- Node.js & Express
- AWS DynamoDB (Free Tier)
- JWT for authentication
- bcryptjs for password hashing
- Deployed on Vercel

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

## Deployment

### Production
- **API Base URL**: https://mboxfitness-backend.vercel.app
- **Health Check**: https://mboxfitness-backend.vercel.app/health
- **Platform**: Vercel (Serverless)

### Local Development
- **DynamoDB Local**: http://localhost:8000
- **DynamoDB Admin**: http://localhost:8001
- **API Server**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

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

### Health Check
```bash
# Production
curl https://mboxfitness-backend.vercel.app/health

# Local
curl http://localhost:3000/health
```

### Authentication
```bash
# Login (Production)
curl -X POST https://mboxfitness-backend.vercel.app/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'

# Login (Local)
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'

# Get current user (requires token)
curl -X GET https://mboxfitness-backend.vercel.app/api/auth/me -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Users
```bash
# Get all trainers
curl -X GET https://mboxfitness-backend.vercel.app/api/users/trainers/list

# Get user profile
curl -X GET https://mboxfitness-backend.vercel.app/api/users/trainer-1
```

### Events
```bash
# Get all events
curl -X GET https://mboxfitness-backend.vercel.app/api/events

# Get trainer's events (requires auth)
curl -X GET https://mboxfitness-backend.vercel.app/api/events/my-events -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Bookings
```bash
# Get user bookings (requires auth)
curl -X GET https://mboxfitness-backend.vercel.app/api/bookings/my-bookings -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get class bookings
curl -X GET https://mboxfitness-backend.vercel.app/api/bookings/class/1
```

### Messages
```bash
# Get user messages (requires auth)
curl -X GET https://mboxfitness-backend.vercel.app/api/messages/my-messages -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get unread count
curl -X GET https://mboxfitness-backend.vercel.app/api/messages/unread/count -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Scripts

- `./scripts/setup-local.sh` - Setup local DynamoDB + test data
- `./scripts/reset-local.sh` - Reset local environment
- `node scripts/create-tables.js` - Create tables only
- `node scripts/seed-data.js` - Load test data only
