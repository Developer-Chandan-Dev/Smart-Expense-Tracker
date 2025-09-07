// components/FreeTrackingDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FileX, Calendar, DollarSign, Tag } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseChart from '@/components/ExpenseChart';
import ExpenseFilter from '@/components/ExpenseFilter';
import ExpenseStats from '@/components/ExpenseStats';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { Expense, User } from '@/types';

interface FreeTrackingDashboardProps {
  token: string;
  user: User;
}

export default function FreeTrackingDashboard({ token, user }: FreeTrackingDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFreeExpenses();
  }, []);

  const loadFreeExpenses = async (filters?: Record<string, any>) => {
    try {
      setError('');
      setDataLoading(true);
      // Add trackingMode parameter to ensure we only get free expenses
      const freeFilter = { ...filters, trackingMode: 'free' };
      const expensesRes = await api.expenses.getAll(token, freeFilter);
      
      const expenseData = expensesRes.expenses || [];
      setExpenses(expenseData);
      setFilteredExpenses(expenseData);
    } catch (error) {
      setError('Failed to load expenses. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleFilter = async (filters: Record<string, any>) => {
    try {
      setFilterLoading(true);
      // Ensure we only filter free expenses
      const freeFilter = { ...filters, trackingMode: 'free' };
      const expensesRes = await api.expenses.getAll(token, freeFilter);
      setFilteredExpenses(expensesRes.expenses || []);
    } catch (error) {
      console.error('Failed to filter expenses');
    } finally {
      setFilterLoading(false);
    }
  };

  const handleAddExpense = async (data: Record<string, any>) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Ensure expense is saved as free tracking mode with no budgetId
      await api.expenses.create({ 
        ...data, 
        trackingMode: 'free',
        budgetId: null // Explicitly set to null for free expenses
      }, token);
      setSuccess('Expense added successfully!');
      loadFreeExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const filteredTotal = filteredExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

  return (
    <div>
      {/* Overview Cards for Free Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {dataLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32 flex items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
              <p className="text-2xl font-bold text-blue-600">₹{totalSpent || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-green-600">{expenses.length || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Avg per Expense</h3>
              <p className="text-2xl font-bold text-purple-600">
                ₹{expenses.length > 0 ? Math.round(totalSpent / expenses.length) : 0 || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">This Month</h3>
              <p className="text-2xl font-bold text-orange-600">
                ₹{expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0) || 0}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseForm 
          onSubmit={handleAddExpense} 
          loading={loading} 
          trackingMode="free"
          budgets={[]}
        />
        
        {dataLoading ? (
          <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : expenses.length > 0 ? (
          <ExpenseChart expenses={expenses} type="pie" />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center">
            <p className="text-gray-500">No expenses data available</p>
          </div>
        )}
      </div>

      {dataLoading ? (
        <div className="mt-6 bg-white p-6 rounded-lg shadow h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : expenses.length > 0 ? (
        <div className="mt-6">
          <ExpenseChart expenses={expenses} type="bar" />
        </div>
      ) : null}

      <div className="mt-8">
        {dataLoading ? (
          <div className="bg-white p-6 rounded-lg shadow h-48 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ExpenseStats expenses={expenses} />
        )}
      </div>

      <div className="mt-8">
        <ExpenseFilter onFilter={handleFilter} />
        
        <div className="bg-white rounded-lg shadow mt-4">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Expense History (Free Tracking)</h3>
              {!filterLoading && !dataLoading && (
                <div className="text-sm text-gray-600">
                  Showing {filteredExpenses.length} expenses • Total: ₹{filteredTotal}
                </div>
              )}
            </div>
            
            <div className="overflow-x-auto">
              {filterLoading || dataLoading ? (
                <div className="py-12 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Description</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense: Expense) => (
                          <tr key={expense._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <FileX className="w-4 h-4 text-gray-400" />
                                {expense.reason || 'No description'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {expense.category || 'Uncategorized'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 font-semibold">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                ₹{expense.amount || 0}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center">
                            <div className="flex flex-col items-center gap-3 text-gray-500">
                              <FileX className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">No expenses found</p>
                              <p className="text-sm">Add your first expense to get started</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  

                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}