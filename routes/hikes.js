const express = require('express');
const Hike = require('../models/Hike');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all hikes
router.get('/', async (req, res) => {
  try {
    const hikes = await Hike.findAll();
    res.json(hikes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create hike (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, location, date, time, difficulty, description } = req.body;
    
    const hike = await Hike.create({
      name,
      location,
      date,
      time,
      difficulty,
      description: description || '',
      createdBy: req.user.id
    });

    res.status(201).json(hike);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete hike (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await Hike.delete(req.params.id);
    res.json({ message: 'Hike deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;