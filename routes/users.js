const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.update(req.user.id, { name, profile });
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainers
router.get('/trainers/list', async (req, res) => {
  try {
    const trainers = await User.findTrainers();
    trainers.forEach(trainer => delete trainer.password);
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;