import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const transactionRoutes = express.Router();

transactionRoutes.get('/',authMiddleware, getTransactions);
transactionRoutes.post('/',authMiddleware, createTransaction);
transactionRoutes.put('/:id',authMiddleware, updateTransaction);
transactionRoutes.delete('/:id',authMiddleware, deleteTransaction);

export default transactionRoutes;
