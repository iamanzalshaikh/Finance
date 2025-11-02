import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createBudget, deleteBudget, getBudgets, updateBudget } from '../controllers/budgetsController.js';


const budgetRoutes = express.Router();


budgetRoutes.get('/', authMiddleware, getBudgets);
budgetRoutes.post('/', authMiddleware,createBudget);
budgetRoutes.put('/:id',authMiddleware ,updateBudget);
budgetRoutes.delete('/:id',authMiddleware , deleteBudget);

export default budgetRoutes;
