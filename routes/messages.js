const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { recipient, content } = req.body;
    
    // Create room ID (consistent ordering)
    const roomId = [req.user.id, recipient].sort().join('_');
    
    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content,
      roomId
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const roomId = [req.user.id, req.params.userId].sort().join('_');
    const messages = await Message.findByRoom(roomId);
    
    // Populate user info
    for (let message of messages) {
      const sender = await User.findById(message.sender);
      const recipient = await User.findById(message.recipient);
      if (sender) {
        delete sender.password;
        message.senderInfo = sender;
      }
      if (recipient) {
        delete recipient.password;
        message.recipientInfo = recipient;
      }
    }
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.findConversations(req.user.id);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:roomId', auth, async (req, res) => {
  try {
    await Message.markAsRead(req.params.roomId);
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;