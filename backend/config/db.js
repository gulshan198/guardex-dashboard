import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export function getMongoUri() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    throw new Error(
      'MONGO_URI is not set. Copy backend/.env.example to backend/.env and add your connection string.'
    );
  }
  return uri;
}

/** Connect and register standard error/open handlers (for one-off scripts). */
export function connectWithHandlers(onOpen) {
  mongoose.connect(getMongoUri(), MONGO_OPTIONS);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  if (onOpen) {
    db.once('open', onOpen);
  }
  return db;
}

/** Promise-based connect (for server startup). */
export async function connectDB() {
  await mongoose.connect(getMongoUri(), MONGO_OPTIONS);
  return mongoose.connection;
}
