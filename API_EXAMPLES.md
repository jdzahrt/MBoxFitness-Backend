# API Testing Examples

## Getting Started

1. Start local environment: `./scripts/setup-local.sh`
2. Start server: `npm run dev`
3. Get JWT token by logging in first

## Authentication Flow

### 1. Login to get JWT token
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### 2. Use token in subsequent requests
```bash
export TOKEN="your_jwt_token_here"
```

## Public Endpoints (No Auth Required)

### Get All Events
```bash
curl -X GET http://localhost:3000/api/events
```

### Get All Trainers
```bash
curl -X GET http://localhost:3000/api/users/trainers/list
```

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/trainer-1
```

### Get Event Bookings
```bash
curl -X GET http://localhost:3000/api/bookings/event/event-1
```

## Protected Endpoints (Auth Required)

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me -H "Authorization: Bearer $TOKEN"
```

### Get My Bookings
```bash
curl -X GET http://localhost:3000/api/bookings/my-bookings -H "Authorization: Bearer $TOKEN"
```

### Get My Events (Trainers Only)
```bash
# Login as trainer first
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"sarah@example.com","password":"password123"}'

# Then get events
curl -X GET http://localhost:3000/api/events/my-events -H "Authorization: Bearer $TRAINER_TOKEN"
```

### Get Conversations
```bash
curl -X GET http://localhost:3000/api/messages/conversations -H "Authorization: Bearer $TOKEN"
```

### Get Conversation with Specific User
```bash
curl -X GET http://localhost:3000/api/messages/conversation/trainer-1 -H "Authorization: Bearer $TOKEN"
```

## POST Examples

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "role": "user"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"event":"event-2","notes":"Looking forward to the HIIT session"}'
```

### Send Message
```bash
curl -X POST http://localhost:3000/api/messages -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"recipient":"trainer-1","content":"What should I bring to the yoga class?"}'
```

### Create Event (Trainers Only)
```bash
curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -H "Authorization: Bearer $TRAINER_TOKEN" -d '{"title":"Evening Pilates","description":"Relaxing pilates session","date":"2024-01-20","time":"19:00","duration":60,"capacity":12,"price":30}'
```

## Test Data IDs

Use these IDs for testing:

- **Users**: `user-1`, `trainer-1`, `trainer-2`
- **Events**: `event-1` (Boxing Bootcamp), `event-2` (Fitness Competition), `event-3` (Nutrition Workshop), `event-4` (Team Building), `event-5` (Charity Run), `event-6` (Boxing Seminar)
- **Bookings**: `booking-1`, `booking-2`
- **Messages**: `message-1`, `message-2`, `message-3`

## Expected Responses

All successful GET requests return JSON data. Error responses include:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error