import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards({ transactions }) {
  const income = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: 'Total Income',
      amount: income.toFixed(2),
      icon: TrendingUp,
      bgGradient: 'from-emerald-500 via-green-500 to-teal-600',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-600',
      trend: '+12.5%',
      trendIcon: ArrowUpRight,
      trendColor: 'text-green-600',
      glowColor: 'shadow-green-500/20',
    },
    {
      title: 'Total Expenses',
      amount: expenses.toFixed(2),
      icon: TrendingDown,
      bgGradient: 'from-rose-500 via-red-500 to-pink-600',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-600',
      trend: '+8.3%',
      trendIcon: ArrowUpRight,
      trendColor: 'text-red-600',
      glowColor: 'shadow-red-500/20',
    },
    {
      title: 'Net Balance',
      amount: balance.toFixed(2),
      icon: Wallet,
      bgGradient: balance >= 0 
        ? 'from-blue-500 via-indigo-500 to-purple-600' 
        : 'from-orange-500 via-red-500 to-rose-600',
      iconBg: balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20',
      iconColor: balance >= 0 ? 'text-blue-600' : 'text-orange-600',
      trend: savingsRate >= 0 ? `${savingsRate}% saved` : `${Math.abs(savingsRate)}% deficit`,
      trendIcon: balance >= 0 ? ArrowUpRight : ArrowDownRight,
      trendColor: balance >= 0 ? 'text-green-600' : 'text-red-600',
      glowColor: balance >= 0 ? 'shadow-blue-500/20' : 'shadow-orange-500/20',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: idx * 0.15,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${card.glowColor}`}></div>
            
            {/* Card */}
            <div className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-xl p-8 text-white overflow-hidden`}>
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`${card.iconBg} backdrop-blur-sm p-3 rounded-xl`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.15 + 0.3 }}
                    className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <TrendIcon className={`w-3 h-3 ${card.trendColor === 'text-green-600' ? 'text-white' : 'text-white/80'}`} />
                    <span className="text-xs font-semibold">{card.trend}</span>
                  </motion.div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">
                    {card.title}
                  </h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.15 + 0.4 }}
                  >
                    <p className="text-4xl font-bold tracking-tight">
                      ${card.amount}
                    </p>
                  </motion.div>
                </div>

                {/* Bottom decoration */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs opacity-75">
                    <span>This month</span>
                    <span className="font-semibold">
                      {transactions.filter(tx => 
                        tx.type === (idx === 0 ? 'income' : idx === 1 ? 'expense' : tx.type)
                      ).length} transactions
                    </span>
                  </div>
                </div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  delay: idx * 0.5,
                  repeatDelay: 5,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}