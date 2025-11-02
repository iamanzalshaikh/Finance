

import React, { useMemo } from 'react';
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function Charts({ transactions }) {
  const categoryData = useMemo(() => {
    const categories = {};
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      });
    return categories;
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) months[monthKey] = { income: 0, expense: 0 };
      if (tx.type === 'income') months[monthKey].income += tx.amount;
      else months[monthKey].expense += tx.amount;
    });
    return months;
  }, [transactions]);

  // Calculate total spending
  const totalSpending = Object.values(categoryData).reduce((sum, val) => sum + val, 0);

  // Modern color palette with gradients
  const colors = [
    { bg: '#6366F1', border: '#4F46E5' }, // Indigo
    { bg: '#10B981', border: '#059669' }, // Green
    { bg: '#F59E0B', border: '#D97706' }, // Amber
    { bg: '#EF4444', border: '#DC2626' }, // Red
    { bg: '#8B5CF6', border: '#7C3AED' }, // Purple
    { bg: '#EC4899', border: '#DB2777' }, // Pink
    { bg: '#14B8A6', border: '#0D9488' }, // Teal
    { bg: '#F97316', border: '#EA580C' }, // Orange
  ];

  const doughnutChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: colors.map(c => c.bg),
        borderColor: colors.map(c => c.border),
        borderWidth: 3,
        hoverOffset: 15,
        spacing: 2,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(monthlyData).map(key => {
      const [year, month] = key.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map((m) => m.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: '#10B981',
      },
      {
        label: 'Expense',
        data: Object.values(monthlyData).map((m) => m.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#EF4444',
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: '#EF4444',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '600',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += '$' + context.parsed.toFixed(2);
            }
            return label;
          }
        }
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
          },
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
    },
  };

  return (
    <>
      {/* Spending by Category - Doughnut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Spending by Category</h3>
                <p className="text-sm text-gray-600">This month's breakdown</p>
              </div>
            </div>
            {totalSpending > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">${totalSpending.toFixed(2)}</p>
              </div>
            )}
          </div>

          {Object.keys(categoryData).length > 0 ? (
            <div className="relative">
              <Doughnut data={doughnutChartData} options={{
                ...chartOptions,
                cutout: '65%',
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    ...chartOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const percentage = ((value / totalSpending) * 100).toFixed(1);
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} />
              
              {/* Center text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-sm text-gray-600 font-semibold">Total</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpending.toFixed(0)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                <PieChart className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No expense data available</p>
              <p className="text-sm text-gray-400 mt-1">Add some expenses to see the breakdown</p>
            </div>
          )}

          {/* Category legend with amounts */}
          {Object.keys(categoryData).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
              {Object.entries(categoryData).slice(0, 6).map(([category, amount], idx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[idx % colors.length].bg }}
                    ></div>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{category}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">${amount.toFixed(0)}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Income vs Expenses - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-red-500"></div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Income vs Expenses</h3>
                <p className="text-sm text-gray-600">Monthly comparison</p>
              </div>
            </div>
            {Object.keys(monthlyData).length > 0 && (
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-semibold text-gray-700">Expenses</span>
                </div>
              </div>
            )}
          </div>

          {Object.keys(monthlyData).length > 0 ? (
            <div className="relative">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                <BarChart3 className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transaction data available</p>
              <p className="text-sm text-gray-400 mt-1">Start tracking to see your trends</p>
            </div>
          )}

          {/* Monthly stats summary */}
          {Object.keys(monthlyData).length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(monthlyData).slice(-3).reverse().map(([month, data], idx) => {
                  const [year, monthNum] = month.split('-');
                  const monthName = new Date(year, monthNum - 1).toLocaleDateString('en-US', { month: 'short' });
                  const net = data.income - data.expense;
                  
                  return (
                    <motion.div
                      key={month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                    >
                      <p className="text-xs text-gray-600 font-semibold mb-2">{monthName}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-600">Income</span>
                          <span className="text-sm font-bold text-green-600">${data.income.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-red-600">Expense</span>
                          <span className="text-sm font-bold text-red-600">${data.expense.toFixed(0)}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-300">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700 font-semibold">Net</span>
                            <span className={`text-sm font-bold ${net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                              {net >= 0 ? '+' : ''}{net.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}