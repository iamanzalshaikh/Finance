
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Lightbulb, BarChart3, DollarSign, PieChart, Zap } from 'lucide-react';

export default function Insights({ insights, transactions }) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });

    const income = currentMonth.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = currentMonth.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

    return { income, expenses, savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0 };
  }, [transactions]);

  const statCards = [
    { 
      label: 'Monthly Income', 
      value: `$${stats.income.toFixed(2)}`, 
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Monthly Expenses', 
      value: `$${stats.expenses.toFixed(2)}`, 
      icon: TrendingDown,
      gradient: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600'
    },
    { 
      label: 'Savings Rate', 
      value: `${stats.savingsRate}%`, 
      icon: PieChart,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`h-2 bg-gradient-to-r ${stat.gradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Smart Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Smart Insights</h3>
          </div>

          {insights?.insights && insights.insights.length > 0 ? (
            <div className="space-y-3">
              {insights.insights.map((insight, idx) => {
                const icons = {
                  warning: AlertCircle,
                  alert: AlertCircle,
                  tip: Lightbulb,
                };
                const Icon = icons[insight.type] || AlertCircle;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 flex gap-4 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed font-medium">{insight.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-white/80">Add more transactions to get personalized insights</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Category Breakdown</h3>
        </div>

        {insights?.summary?.categoryBreakdown && Object.keys(insights.summary.categoryBreakdown).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(insights.summary.categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount], idx) => {
                const total = Object.values(insights.summary.categoryBreakdown).reduce((sum, val) => sum + val, 0);
                const percentage = ((amount / total) * 100).toFixed(1);
                
                const colors = [
                  'from-blue-500 to-indigo-600',
                  'from-purple-500 to-pink-600',
                  'from-green-500 to-emerald-600',
                  'from-orange-500 to-red-600',
                  'from-cyan-500 to-blue-600',
                ];
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 capitalize">{category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium">{percentage}%</span>
                        <span className="text-lg font-bold text-gray-900">${amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.6 + idx * 0.1 }}
                        className={`h-3 bg-gradient-to-r ${colors[idx % colors.length]} rounded-full shadow-lg`}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <PieChart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No expense categories yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}