const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    // Create room ID (consistent ordering)
    const roomId = [req.user._id, recipientId].sort().join('_');
    
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      roomId
    });

    await message.save();
    await message.populate(['sender', 'recipient'], 'name');
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const roomId = [req.user._id, req.params.userId].sort().join('_');
    
    const messages = await Message.find({ roomId })
      .populate(['sender', 'recipient'], 'name')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$roomId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    await Message.populate(conversations, {
      path: 'lastMessage.sender lastMessage.recipient',
      select: 'name'
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:roomId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        roomId: req.params.roomId,
        recipient: req.user._id,
        read: false
      },
      { read: true }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;