import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Download, Filter, Search, Calendar, Tag, ArrowUpDown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function TransactionList({ transactions, onRefresh }) {
  const { deleteTransaction, exportCSV, exportPDF } = useUser();
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount') return b.amount - a.amount;
    if (sortBy === 'type') return a.type.localeCompare(b.type);
    return 0;
  });

  const handleDelete = async (id) => {
    if (confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(id);
        onRefresh();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Transaction History</h2>
              <p className="text-white/80">Total: {transactions.length} transactions</p>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportCSV}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all border border-white/30"
              >
                <Download className="w-4 h-4" />
                CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all border border-white/30"
              >
                <Download className="w-4 h-4" />
                PDF
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Type */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {sorted.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Type
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sorted.map((tx, idx) => (
                    <motion.tr
                      key={tx._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="border-b border-gray-100 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(tx.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                            tx.type === 'income'
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tx.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-semibold text-gray-900 capitalize">{tx.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-700">{tx.description}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-lg font-bold ${
                          tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(tx._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm || filterType !== 'all' ? 'No transactions match your filters' : 'No transactions yet'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}