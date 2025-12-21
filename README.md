# MBoxFitness Backend

Backend API for the MBoxFitness React Native fitness marketplace app.

🌐 **Live API**: https://mboxfitness-backend.vercel.app

## Dependencies

**Required for MBoxFitness React Native App**: This backend service is required for the [MBoxFitness React Native app](https://github.com/jessezahrt/MBoxFitness) to function properly.

## Features

- JWT Authentication & User Management
- Fitness class booking & scheduling
- RESTful API endpoints
- AWS DynamoDB integration

## Tech Stack

- Node.js & Express
- AWS DynamoDB
- JWT Authentication
- Deployed on Vercel

## Quick Start

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

## Environment Variables

Copy `.env.example` to `.env` and configure:
- AWS credentials for DynamoDB
- JWT secret for authentication
- Set `DYNAMODB_LOCAL=true` for local development

## Deployment

- **Production**: https://mboxfitness-backend.vercel.app
- **Local**: http://localhost:3000
- **Health Check**: `/health` endpoint

### Test Accounts
- User: `john@example.com`
- Trainer: `sarah@example.com`
- Trainer: `mike@example.com`

*Default password for all test accounts: `password123`*

## AWS Setup

1. Create AWS account (free tier)
2. Get AWS credentials from IAM
3. Set `DYNAMODB_LOCAL=false` in .env
4. Run: `node scripts/create-tables.js`

## API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Current user profile
- `GET /api/events` - List fitness classes
- `GET /api/bookings/my-bookings` - User bookings
- `GET /api/users/trainers/list` - Available trainers

### Example Usage
```bash
# Health check
curl https://mboxfitness-backend.vercel.app/health

# Login
curl -X POST https://mboxfitness-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"test_password"}'
```

## Scripts

- `./scripts/setup-local.sh` - Complete local setup
- `./scripts/reset-local.sh` - Reset environment
- `node scripts/create-tables.js` - Create DynamoDB tables
- `node scripts/seed-data.js` - Load test data
