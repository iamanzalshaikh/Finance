import Transaction from '../models/Transaction.js';

export const getInsights = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthTransactions = await Transaction.find({
      userId: req.userId,
      type: 'expense',
      date: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      },
    });

    const lastMonthTransactions = await Transaction.find({
      userId: req.userId,
      type: 'expense',
      date: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
      },
    });

    const categorySpending = {};
    const lastCategorySpending = {};

    currentMonthTransactions.forEach(tx => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

    lastMonthTransactions.forEach(tx => {
      lastCategorySpending[tx.category] = (lastCategorySpending[tx.category] || 0) + tx.amount;
    });

    const insights = [];

    for (const [category, amount] of Object.entries(categorySpending)) {
      const lastAmount = lastCategorySpending[category] || 0;
      const percentChange = lastAmount > 0 ? ((amount - lastAmount) / lastAmount) * 100 : 100;

      if (percentChange > 20) {
        insights.push({
          type: 'warning',
          message: `You spent ${percentChange.toFixed(0)}% more on ${category} this month than last month.`,
        });
      }
    }

    const totalSpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
    const avgMonthlySpending =
      (Object.values(categorySpending).reduce((a, b) => a + b, 0) +
        Object.values(lastCategorySpending).reduce((a, b) => a + b, 0)) / 2;

    if (totalSpending > avgMonthlySpending * 1.15) {
      insights.push({
        type: 'alert',
        message: 'Your spending is 15% above average. Consider reducing expenses to save more.',
      });
    }

    const maxCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    if (maxCategory) {
      const savingPotential = maxCategory[1] * 0.1;
      insights.push({
        type: 'tip',
        message: `Reducing ${maxCategory[0]} expenses by 10% could save you ${savingPotential.toFixed(2)} this month.`,
      });
    }

    res.json({
      insights,
      summary: { totalSpending, categoryBreakdown: categorySpending, avgMonthlySpending },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
