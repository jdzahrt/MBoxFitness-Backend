const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Events';

class Event {
  static async create(eventData) {
    const event = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: event
    }));

    return event;
  }

  static async findAll() {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': 'active' }
    }));

    return result.Items;
  }

  static async findById(id) {
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item || null;
  }

  static async findByTrainer(trainerId) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'trainer = :trainer',
      ExpressionAttributeValues: { ':trainer': trainerId }
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

module.exports = Event;