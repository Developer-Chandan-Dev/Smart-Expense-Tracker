// components/ExpenseChart.tsx (with loading state)
'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { Expense, ChartData } from '@/types';

interface ExpenseChartProps {
  expenses: Expense[];
  type: 'pie' | 'bar';
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#48DBFB'];

export default function ExpenseChart({ expenses, type, loading }: ExpenseChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-80">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Process data for charts
  const categoryData: ChartData[] = expenses.reduce((acc: ChartData[], expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  const monthlyData: ChartData[] = expenses.reduce((acc: ChartData[], expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    const existing = acc.find(item => item.name === monthYear);
    if (existing) {
      existing.amount = (existing.amount || 0) + expense.amount;
    } else {
      acc.push({ name: monthYear, value: 0, amount: expense.amount });
    }
    return acc;
  }, []);

  if (expenses.length === 0) {
    const ChartIcon = type === 'pie' ? PieChartIcon : BarChart3;
    return (
      <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center h-80">
        <ChartIcon className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-500 mb-2">No data available</p>
        <p className="text-sm text-gray-400">Add some expenses to see the {type} chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {type === 'pie' ? 'Expenses by Category' : 'Monthly Expenses'}
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
            </PieChart>
          ) : (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Amount" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}