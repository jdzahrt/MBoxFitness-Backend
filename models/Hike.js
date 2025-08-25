const dynamodb = require('../config/dynamodb');
const { PutCommand, ScanCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'MBoxFitness-Hikes';

class Hike {
  static async create(hikeData) {
    const hike = {
      id: uuidv4(),
      ...hikeData,
      createdAt: new Date().toISOString()
    };

    await dynamodb.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: hike
    }));

    return hike;
  }

  static async findAll() {
    const result = await dynamodb.send(new ScanCommand({
      TableName: TABLE_NAME
    }));

    return result.Items.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  static async findById(id) {
    const result = await dynamodb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item || null;
  }

  static async delete(id) {
    await dynamodb.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));
  }
}

module.exports = Hike;