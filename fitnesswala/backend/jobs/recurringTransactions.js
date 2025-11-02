import Transaction from '../models/Transaction.js';

export const handleRecurringTransactions = async () => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      recurringType: 'monthly',
      date: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        $lte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
      },
    });

    for (const tx of recurringTransactions) {
      const newTransaction = new Transaction({
        userId: tx.userId,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        category: tx.category,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        isRecurring: true,
        recurringType: 'monthly',
        currency: tx.currency,
      });

      await newTransaction.save();
    }

    console.log('Recurring transactions processed');
  } catch (err) {
    console.error('Error processing recurring transactions:', err);
  }
};
