#!/bin/bash

echo "Setting up local DynamoDB environment..."

# Start DynamoDB Local
docker-compose up -d

# Wait for DynamoDB to be ready
echo "Waiting for DynamoDB Local to start..."
sleep 5

# Create tables
echo "Creating DynamoDB tables..."
DYNAMODB_LOCAL=true NODE_ENV=development node scripts/create-tables.js

# Seed test data
echo "Seeding test data..."
DYNAMODB_LOCAL=true NODE_ENV=development node scripts/seed-data.js

echo "Local setup complete!"
echo "DynamoDB Local: http://localhost:8000"
echo "DynamoDB Admin: http://localhost:8001"
echo ""
echo "Test accounts:"
echo "User: john@example.com / password123"
echo "Trainer: sarah@example.com / password123"
echo "Trainer: mike@example.com / password123"