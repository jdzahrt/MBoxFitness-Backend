#!/bin/bash

echo "Resetting local DynamoDB..."

# Stop containers
docker-compose down

# Remove data volume
rm -rf docker/dynamodb

# Restart and setup
./scripts/setup-local.sh