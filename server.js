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

// Password reset redirect endpoint
app.get('/reset-password', (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>Invalid Reset Link</h2>
          <p>This password reset link is invalid or missing a token.</p>
        </body>
      </html>
    `);
  }
  
  // Try to open the app first, then show fallback
  const deepLink = `mboxfitness://reset-password?token=${token}`;
  
  res.send(`
    <html>
      <head>
        <title>MBoxFitness - Reset Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h2>MBoxFitness Password Reset</h2>
        <p>Click the button below to open the MBoxFitness app and reset your password:</p>
        <a href="${deepLink}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px;">Open MBoxFitness App</a>
        <p style="margin-top: 30px; color: #666;">If the app doesn't open automatically, please copy this token and use it in the app:</p>
        <code style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; display: inline-block;">${token}</code>
        <script>
          // Attempt to open the app automatically
          setTimeout(() => {
            window.location.href = '${deepLink}';
          }, 1000);
        </script>
      </body>
    </html>
  `);
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
