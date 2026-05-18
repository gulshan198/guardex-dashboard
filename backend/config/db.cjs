const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

function getMongoUri() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error(
      'MONGO_URI is not set. Copy backend/.env.example to backend/.env and add your connection string.'
    );
  }
  return uri;
}

function connectWithHandlers(onOpen) {
  mongoose.connect(getMongoUri(), MONGO_OPTIONS);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  if (onOpen) {
    db.once('open', onOpen);
  }
  return db;
}

module.exports = { connectWithHandlers, getMongoUri };
