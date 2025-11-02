
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, TrendingUp, TrendingDown, PieChart, BarChart3, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import TransactionList from '../components/TransactionList';
import Insights from '../components/Insights';
import AddTransactionModal from '../components/AddTransactionModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { transactions, fetchTransactions, fetchInsights, insights } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTransactions(filters);
      fetchInsights();
    }
  }, [user, filters]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Premium Header with Brand */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Made by ANZAL SHAIKH</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm opacity-90"
          >
            Premium Finance Management
          </motion.div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo & User Info */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Hey, {user?.name || 'User'} 👋
                </p>
              </div>
            </motion.div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all border border-red-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200/50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-6 font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold border border-red-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Financial Overview</h2>
                  <p className="text-gray-600 mt-1">Track your income and expenses at a glance</p>
                </div>
              </div>
              <SummaryCards transactions={transactions} />
              <div className="grid md:grid-cols-2 gap-6">
                <Charts transactions={transactions} />
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">All Transactions</h2>
                <p className="text-gray-600 mt-1">View and manage your transaction history</p>
              </div>
              <TransactionList 
                transactions={transactions} 
                onRefresh={() => fetchTransactions(filters)} 
              />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Smart Insights</h2>
                <p className="text-gray-600 mt-1">AI-powered analysis of your spending patterns</p>
              </div>
              <Insights insights={insights} transactions={transactions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchTransactions(filters);
              fetchInsights();
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}