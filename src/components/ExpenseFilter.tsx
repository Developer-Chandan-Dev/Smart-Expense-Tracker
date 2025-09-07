'use client';

import { useState } from 'react';

const categories = [
  "All", "Food & Drinks", "Shopping", "Transport", "Bills & Utilities",
  "Rent", "Healthcare", "Entertainment", "Travel", "Education",
  "Investments", "Savings", "Other"
];

import { ExpenseFilters } from '@/types';

interface ExpenseFilterProps {
  onFilter: (filters: ExpenseFilters) => void;
}

export default function ExpenseFilter({ onFilter }: ExpenseFilterProps) {
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
    period: 'all'
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const apiFilters: ExpenseFilters = {};
    if (newFilters.category !== 'All') apiFilters.category = newFilters.category;
    if (newFilters.startDate) apiFilters.startDate = newFilters.startDate;
    if (newFilters.endDate) apiFilters.endDate = newFilters.endDate;
    
    // Handle period filters
    if (newFilters.period !== 'all') {
      const now = new Date();
      if (newFilters.period === 'today') {
        apiFilters.startDate = now.toISOString().split('T')[0];
        apiFilters.endDate = now.toISOString().split('T')[0];
      } else if (newFilters.period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        apiFilters.startDate = weekAgo.toISOString().split('T')[0];
      } else if (newFilters.period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        apiFilters.startDate = monthAgo.toISOString().split('T')[0];
      }
    }
    
    onFilter(apiFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Filter Expenses</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}