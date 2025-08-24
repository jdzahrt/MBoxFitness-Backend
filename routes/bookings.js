const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { classId, date, time, price, notes } = req.body;

    const booking = await Booking.create({
      classId,
      date,
      time,
      price,
      user: req.user.id,
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
    console.log(bookings)
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class bookings
router.get('/class/:classId', async (req, res) => {
  try {
    const bookings = await Booking.findByClass(parseInt(req.params.classId));

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
