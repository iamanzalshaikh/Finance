import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Budgets() {
  const { user, logout } = useAuth();
  const { budgets, fetchBudgets, setBudget, deleteBudget } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchBudgets();
    }
  }, [user]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await setBudget({ category, limit: parseFloat(limit), month, currency: 'USD' });
      setCategory('');
      setLimit('');
      setMonth(new Date().toISOString().slice(0, 7));
      setShowAddForm(false);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to add budget:', err);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (confirm('Delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Planner</h1>
            <p className="text-xs text-gray-500">Welcome, {user?.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              New Budget
            </motion.button>

            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Budget</h3>
            <form onSubmit={handleAddBudget} className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Food"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Add Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-4">
          {budgets && budgets.length > 0 ? (
            budgets.map((budget) => {
              const percentageUsed = (budget.spent / budget.limit) * 100;
              const isExceeded = budget.spent > budget.limit;

              return (
                <motion.div
                  key={budget._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                    isExceeded ? 'border-red-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-600">{budget.month}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExceeded && (
                        <div className="flex items-center gap-1 bg-red-50 px-3 py-1 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-600">
                            Over budget by ${(budget.spent - budget.limit).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Spent: ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isExceeded ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {percentageUsed.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          isExceeded ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      />
                    </div>

                    {!isExceeded && (
                      <p className="text-xs text-gray-600">
                        Remaining: ${(budget.limit - budget.spent).toFixed(2)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">No budgets yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
