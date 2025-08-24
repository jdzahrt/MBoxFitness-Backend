const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Test login for development
router.post('/test-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Test login not available in production' });
  }

  try {
    const { userId = 1 } = req.body;

    const testUsers = [
      { id: 'test-user-1', email: 'test1@example.com', name: 'Test User 1', role: 'user' },
      { id: 'test-user-2', email: 'test2@example.com', name: 'Test User 2', role: 'trainer' },
      { id: 'test-user-3', email: 'admin@example.com', name: 'Admin User', role: 'admin' }
    ];

    const testUser = testUsers[userId - 1] || testUsers[0];
    const token = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: testUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
