const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const hikeRoutes = require('./routes/hikes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Handle common browser requests
app.get('/', (req, res) => res.status(204).end());
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hikes', hikeRoutes);

const PORT = process.env.PORT || 3000;

// Log DynamoDB configuration on startup
const isLocal = process.env.NODE_ENV === 'development' && process.env.DYNAMODB_LOCAL === 'true';
console.log('=== DynamoDB Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DYNAMODB_LOCAL:', process.env.DYNAMODB_LOCAL);
console.log('Using:', isLocal ? 'LOCAL DynamoDB (http://localhost:8000)' : 'AWS DynamoDB');
console.log('AWS_REGION:', process.env.AWS_REGION);
if (isLocal) {
  console.log('Local credentials: local/local');
} else {
  console.log('prod');
}
console.log('==============================');

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
