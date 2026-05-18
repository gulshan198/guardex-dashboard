import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import alertRoutes from './routes/alerts.js';

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.set('strictQuery', true);

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(express.json());
app.use('/alerts', alertRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
