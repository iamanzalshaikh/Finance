import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
    min: 0,
  },
  month: {
    type: String,
    required: true,
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

budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
