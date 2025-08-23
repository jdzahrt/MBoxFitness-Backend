const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Users';

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = {
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'user',
      profile: userData.profile || {},
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: user
    }));

    return user;
  }

  static async findByEmail(email) {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }));

    return result.Items[0] || null;
  }

  static async findById(id) {
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item || null;
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

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findTrainers() {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#role = :role',
      ExpressionAttributeNames: { '#role': 'role' },
      ExpressionAttributeValues: { ':role': 'trainer' }
    }));

    return result.Items;
  }
}

module.exports = User;