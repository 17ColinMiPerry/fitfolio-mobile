import express from 'express';
import cors from 'cors';
import { exerciseEndpoints } from './endpoints/exercise.ts';
import { userEndpoints } from './endpoints/user.ts';
import { workoutEndpoints } from './endpoints/workout.ts';
import { setEndpoints } from './endpoints/set.ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add headers to ensure JSON responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Accept', 'application/json');
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Register endpoints
exerciseEndpoints(app);
userEndpoints(app);
workoutEndpoints(app);
setEndpoints(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Base URI: http://localhost:${PORT}/api`);
});

export default app; 