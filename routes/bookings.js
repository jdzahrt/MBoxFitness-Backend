const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { event, notes } = req.body;
    
    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      event,
      notes
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.id);
    
    // Populate event info
    for (let booking of bookings) {
      const event = await Event.findById(booking.event);
      if (event) {
        booking.eventInfo = event;
      }
    }
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event bookings
router.get('/event/:eventId', async (req, res) => {
  try {
    const bookings = await Booking.findByEvent(req.params.eventId);
    
    // Populate user info
    for (let booking of bookings) {
      const user = await User.findById(booking.user);
      if (user) {
        delete user.password;
        booking.userInfo = user;
      }
    }
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.update(req.params.id, { status });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;