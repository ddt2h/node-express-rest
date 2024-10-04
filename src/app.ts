import express from 'express';
import mongoose from 'mongoose';

import taskRoutes from './routes/task.routes';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoURL, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use('/task', taskRoutes);

export default app;
