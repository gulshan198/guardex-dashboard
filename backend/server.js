import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import alertRoutes from './routes/alerts.js';
import resolvedAlertRoutes from './routes/resolvedAlerts.js';

const app = express();
const PORT = process.env.PORT || 8001;

connectDB()
  .then((db) => {
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use('/alerts', alertRoutes);
app.use('/resolved-alerts', resolvedAlertRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
