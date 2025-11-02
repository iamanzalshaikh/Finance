import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const [year, month] = budget.month.split('-');
        const startDate = new Date(year, parseInt(month) - 1, 1);
        const endDate = new Date(year, parseInt(month), 0);

        const spent = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              category: budget.category,
              type: 'expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        return { ...budget.toObject(), spent: spent[0]?.total || 0 };
      })
    );

    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBudget = async (req, res) => {
  try {
    const { category, limit, month, currency } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = new Budget({
      userId: req.userId,
      category,
      limit,
      month,
      currency: currency || 'USD',
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Budget already exists for this category and month' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
