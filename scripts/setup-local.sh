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

echo "Local setup complete!"
echo "DynamoDB Local: http://localhost:8000"
echo "DynamoDB Admin: http://localhost:8001"