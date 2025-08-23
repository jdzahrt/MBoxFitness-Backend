const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Bookings';

class Booking {
  static async create(bookingData) {
    const booking = {
      id: uuidv4(),
      classId: bookingData.classId,
      date: bookingData.date,
      time: bookingData.time,
      price: bookingData.price,
      user: bookingData.user,
      status: bookingData.status || 'pending',
      paymentStatus: bookingData.paymentStatus || 'pending',
      notes: bookingData.notes || '',
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: booking
    }));

    return booking;
  }

  static async findById(id) {
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item || null;
  }

  static async findByUser(userId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#user = :user',
      ExpressionAttributeNames: { '#user': 'user' },
      ExpressionAttributeValues: { ':user': userId }
    }));

    return result.Items;
  }

  static async findByClass(classId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'classId = :classId',
      ExpressionAttributeValues: { ':classId': classId }
    }));

    return result.Items;
  }

  static async update(id, updates) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    Object.keys(updates).forEach(key => {
      updateExpression.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = updates[key];
    });

    const result = await dynamodb.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    return result.Attributes;
  }
}

module.exports = Booking;