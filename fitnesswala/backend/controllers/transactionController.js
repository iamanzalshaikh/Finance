import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    const filter = { userId: req.userId };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, isRecurring, recurringType, currency } = req.body;

    if (!type || !amount || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      type,
      amount,
      description,
      category,
      date: date || new Date(),
      isRecurring: isRecurring || false,
      recurringType: recurringType || 'none',
      currency: currency || 'USD',
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
