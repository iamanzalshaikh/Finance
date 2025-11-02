import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const authRoutes = express.Router();

// Routes
authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.get('/me', authMiddleware, getCurrentUser); // ✅ NEW ROUTE


export default authRoutes;
