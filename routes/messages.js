const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message/notification
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content, type, title } = req.body;
    
    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content,
      type: type || 'message',
      title: title || 'New Message'
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user messages (inbox)
router.get('/my-messages', auth, async (req, res) => {
  try {
    const messages = await Message.findByUser(req.user.id);
    
    // Populate sender info
    for (let message of messages) {
      const sender = await User.findById(message.sender);
      if (sender) {
        delete sender.password;
        message.senderInfo = sender;
      }
    }
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific message
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is recipient
    if (message.recipient !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Populate sender info
    const sender = await User.findById(message.sender);
    if (sender) {
      delete sender.password;
      message.senderInfo = sender;
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.recipient !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Message.markAsRead(req.params.id);
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;