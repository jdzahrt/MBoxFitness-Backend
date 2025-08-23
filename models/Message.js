const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Messages';

class Message {
  static async create(messageData) {
    const message = {
      id: uuidv4(),
      ...messageData,
      read: false,
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: message
    }));

    return message;
  }

  static async findByRoom(roomId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'roomId = :roomId',
      ExpressionAttributeValues: { ':roomId': roomId }
    }));

    return result.Items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  static async findConversations(userId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'sender = :userId OR recipient = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }));

    const conversations = {};
    result.Items.forEach(message => {
      const otherUser = message.sender === userId ? message.recipient : message.sender;
      if (!conversations[otherUser] || new Date(message.createdAt) > new Date(conversations[otherUser].createdAt)) {
        conversations[otherUser] = message;
      }
    });

    return Object.values(conversations);
  }

  static async markAsRead(roomId) {
    const messages = await this.findByRoom(roomId);
    const unreadMessages = messages.filter(msg => !msg.read);

    for (const message of unreadMessages) {
      await dynamodb.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: message.id },
        UpdateExpression: 'SET #read = :read',
        ExpressionAttributeNames: { '#read': 'read' },
        ExpressionAttributeValues: { ':read': true }
      }));
    }
  }
}

module.exports = Message;