#!/bin/bash

echo "Testing MBoxFitness API..."

# Test login and get token
echo "1. Testing login..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')

echo "Login response: $RESPONSE"

# Extract token (requires jq for JSON parsing, fallback to manual)
if command -v jq &> /dev/null; then
    TOKEN=$(echo $RESPONSE | jq -r '.token')
    echo "Token extracted: ${TOKEN:0:50}..."
else
    echo "Install 'jq' for automatic token extraction, or copy token manually"
    echo "Token is in the 'token' field of the response above"
    read -p "Enter token: " TOKEN
fi

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo ""
    echo "2. Testing authenticated endpoints..."
    
    echo "Getting current user:"
    curl -s -X GET http://localhost:3000/api/auth/me \
      -H "Authorization: Bearer $TOKEN" | head -c 200
    echo ""
    
    echo "Getting user bookings:"
    curl -s -X GET http://localhost:3000/api/bookings/my-bookings \
      -H "Authorization: Bearer $TOKEN" | head -c 200
    echo ""
else
    echo "Login failed or token not found"
fi

echo ""
echo "3. Testing public endpoints..."

echo "Getting all events:"
curl -s -X GET http://localhost:3000/api/events | head -c 200
echo ""

echo "Getting all trainers:"
curl -s -X GET http://localhost:3000/api/users/trainers/list | head -c 200
echo ""

echo "API testing complete!"