// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cron from 'node-cron';

// import { handleRecurringTransactions } from './jobs/recurringTransactions.js';
// import budgetRoutes from './routes/budgetRoutes.js';
// import transactionRoutes from './routes/transactionRoutes.js';
// import exportRoutes from './routes/exportRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import insightRoutes from './routes/insightRoutes.js';

// dotenv.config();

// const app = express();

// // ✅ Allow frontend access
// app.use(
//   cors({
//     origin: [
//       'http://localhost:5173', // ✅ Local development (Vite)
//       'https://finance-5aly.onrender.com', // ✅ Production frontend (Render)
//     ],
//     credentials: true, // ✅ Allow cookies & authentication
//   })
// )

// app.use(express.json());

// // ✅ MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/budgets', budgetRoutes);
// app.use('/api/export', exportRoutes);
// app.use('/api/insights', insightRoutes);

// // ✅ Schedule recurring jobs
// cron.schedule('0 0 1 * *', handleRecurringTransactions);

// // ✅ Start server
// const PORT = process.env.PORT || 8006;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// ✅ STEP 1: Cookie parser FIRST (before any routes)
app.use(cookieParser());
console.log('🍪 Cookie parser middleware loaded');


// app.use(cors({
//   origin: 'https://finance-5aly.onrender.com', // ✅ Your deployed frontend
//   credentials: true, // ✅ Allow cookies & sessions
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));



app.use(
  cors({
    origin: "https://financeflow12345.netlify.app", // Your Netlify frontend URL
    credentials: true, // Allow cookies, tokens, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log('✅ CORS configured for production: https://finance-5aly.onrender.com');

console.log('🔧 CORS configured for localhost + Render frontend');
// ✅ STEP 3: Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STEP 4: Debug middleware - Log cookies on every request
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log('🍪 Cookies received:', req.cookies);
  console.log('📍 Origin:', req.headers.origin);
  next();
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Import routes
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import exportRoutes from './routes/exportRoutes.js';

// ✅ Use routes (make sure path matches your frontend API calls)
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/export', exportRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cookies: req.cookies 
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 8006;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Accepting requests from: http://localhost:5173`);
  console.log(`🍪 Cookie authentication enabled\n`);
});
