// src/config/database.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error('MONGO_URL is not defined in the environment');
}

let client;
let db;

const DB_NAME = 'zorvyn_finance';

async function connectDB() {
  if (db) {
    return db;
  }

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(DB_NAME);

  const usersCollection = db.collection('users');
  const recordsCollection = db.collection('records');

  const existingAdmin = await usersCollection.findOne({ username: 'admin_user' });
  if (!existingAdmin) {
    await usersCollection.insertOne({
      username: 'admin_user',
      role: 'ADMIN',
      status: 'active',
    });
  }

  await recordsCollection.createIndex({ date: 1 });

  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

module.exports = { connectDB, getDB };