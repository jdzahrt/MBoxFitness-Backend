const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.findAll();
    
    // Populate trainer info
    for (let event of events) {
      const trainer = await User.findById(event.trainer);
      if (trainer) {
        delete trainer.password;
        event.trainerInfo = trainer;
      }
    }
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (trainers only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create events' });
    }

    const event = await Event.create({
      ...req.body,
      trainer: req.user.id,
      status: 'active'
    });
    
    event.trainerInfo = req.user;
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer's events
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.findByTrainer(req.user.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.trainer !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedEvent = await Event.update(req.params.id, req.body);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;