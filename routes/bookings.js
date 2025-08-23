const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, notes } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingBooking = await Booking.findOne({
      user: req.user._id,
      event: eventId,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Already booked this event' });
    }

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      notes
    });

    await booking.save();
    await booking.populate(['user', 'event']);
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer's event bookings
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event || event.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('event');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only trainer can confirm/cancel bookings
    if (booking.event.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;