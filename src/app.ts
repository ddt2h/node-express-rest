import express from 'express';
import mongoose from 'mongoose';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import taskRoutes from './routes/task.routes';
import { swaggerOptions } from './swagger/swagger.options';

const specs = swaggerJsdoc(swaggerOptions);
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoURL, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use(express.json());
app.use('/task', taskRoutes);

export default app;
