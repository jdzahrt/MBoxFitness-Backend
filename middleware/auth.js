const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.userId);

    // Handle test users in development
    if (!user && decoded.userId.startsWith('test-user-') && process.env.NODE_ENV !== 'production') {
      const testUsers = {
        'test-user-1': { id: 'test-user-1', email: 'test1@example.com', name: 'Test User 1', role: 'user' },
        'test-user-2': { id: 'test-user-2', email: 'test2@example.com', name: 'Test User 2', role: 'trainer' },
        'test-user-3': { id: 'test-user-3', email: 'admin@example.com', name: 'Admin User', role: 'admin' }
      };
      user = testUsers[decoded.userId];
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
