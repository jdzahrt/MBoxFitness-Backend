const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Messages';

class Message {
  static async create(messageData) {
    const message = {
      id: uuidv4(),
      ...messageData,
      read: false,
      type: messageData.type || 'message',
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: message
    }));

    return message;
  }

  static async findByUser(userId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'recipient = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }));

    return result.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findById(id) {
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item || null;
  }

  static async markAsRead(messageId) {
    await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: messageId },
      UpdateExpression: 'SET #read = :read',
      ExpressionAttributeNames: { '#read': 'read' },
      ExpressionAttributeValues: { ':read': true }
    }));
  }

  static async getUnreadCount(userId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'recipient = :userId AND #read = :read',
      ExpressionAttributeNames: { '#read': 'read' },
      ExpressionAttributeValues: { 
        ':userId': userId,
        ':read': false
      }
    }));

    return result.Items.length;
  }
}

module.exports = Message;