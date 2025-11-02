import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';

import { handleRecurringTransactions } from './jobs/recurringTransactions.js';
import budgetRoutes from './routes/budgetRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import insightRoutes from './routes/insightRoutes.js';

dotenv.config();

const app = express();

// ✅ Allow frontend access
app.use(
  cors({
    origin: [
      'http://localhost:5173', // ✅ Local development (Vite)
      'https://finance-5aly.onrender.com', // ✅ Production frontend (Render)
    ],
    credentials: true, // ✅ Allow cookies & authentication
  })
)

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/insights', insightRoutes);

// ✅ Schedule recurring jobs
cron.schedule('0 0 1 * *', handleRecurringTransactions);

// ✅ Start server
const PORT = process.env.PORT || 8006;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
