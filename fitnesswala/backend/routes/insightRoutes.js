import express from 'express';
import { getInsights } from '../controllers/insightsController.js';
import { authMiddleware } from '../middleware/auth.js';

const insightRoutes = express.Router();

// Get AI-driven spending insights
insightRoutes.get('/', authMiddleware, getInsights);

export default insightRoutes;
