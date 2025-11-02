import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringType: {
    type: String,
    enum: ['monthly', 'yearly', 'none'],
    default: 'none',
  },
  currency: {
    type: String,
    default: 'USD',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Transaction', transactionSchema);
