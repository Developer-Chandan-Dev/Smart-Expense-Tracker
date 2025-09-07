// components/ExpenseStats.tsx (with loading state)
'use client';

import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { Expense } from '@/types';

interface ExpenseStatsProps {
  expenses: Expense[];
  loading?: boolean;
}

export default function ExpenseStats({ expenses, loading }: ExpenseStatsProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6 h-48 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Expense Statistics</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-500 mb-2">No statistics available</p>
          <p className="text-sm text-gray-400">Add some expenses to see detailed statistics</p>
        </div>
      </div>
    );
  }

  // Calculate statistics with null safety
  const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;
  const amounts = expenses.map(e => e.amount || 0).filter(amount => amount > 0);
  const highest = amounts.length > 0 ? Math.max(...amounts) : 0;
  const lowest = amounts.length > 0 ? Math.min(...amounts) : 0;
  
  // Calculate trend (compare this month to previous month)
  const now = new Date();
  const thisMonth = expenses.filter(e => {
    if (!e.date) return false;
    const date = new Date(e.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const lastMonth = expenses.filter(e => {
    if (!e.date) return false;
    const date = new Date(e.date);
    return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
  });
  
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + (e.amount || 0), 0);
  const lastMonthTotal = lastMonth.reduce((sum, e) => sum + (e.amount || 0), 0);
  
  let trendIcon = <Minus className="w-4 h-4" />;
  let trendColor = "text-gray-600";
  
  if (lastMonthTotal > 0) {
    const trend = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (trend > 0) {
      trendIcon = <TrendingUp className="w-4 h-4" />;
      trendColor = "text-red-600";
    } else if (trend < 0) {
      trendIcon = <TrendingDown className="w-4 h-4" />;
      trendColor = "text-green-600";
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Expense Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold">₹{total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{expenses.length} transactions</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Average Expense</p>
          <p className="text-2xl font-bold">₹{average.toFixed(2)}</p>
          <p className="text-sm text-gray-600">per transaction</p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600">Highest Expense</p>
          <p className="text-2xl font-bold">₹{highest.toFixed(2)}</p>
          <p className="text-sm text-gray-600">single transaction</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Monthly Trend</p>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold">₹{thisMonthTotal.toFixed(2)}</p>
            <span className={trendColor}>{trendIcon}</span>
          </div>
          <p className="text-sm text-gray-600">this month</p>
        </div>
      </div>
    </div>
  );
}