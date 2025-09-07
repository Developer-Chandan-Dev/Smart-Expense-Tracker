// components/BudgetTrackingDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { FileX, AlertCircle, Calendar, DollarSign, Tag, Wallet } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseChart from '@/components/ExpenseChart';
import ExpenseFilter from '@/components/ExpenseFilter';
import BudgetAlert from '@/components/BudgetAlert';
import ExpenseStats from '@/components/ExpenseStats';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { User, Expense, Budget } from '@/types';

interface BudgetTrackingDashboardProps {
  token: string;
  user: User;
}

export default function BudgetTrackingDashboard({ token, user }: BudgetTrackingDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async (filters?: Record<string, any>) => {
    try {
      setError('');
      setDataLoading(true);
      // Add trackingMode parameter to ensure we only get budget expenses
      const budgetFilter = { ...filters, trackingMode: 'budget' };
      const [expensesRes, budgetRes, allBudgetsRes] = await Promise.all([
        api.expenses.getAll(token, budgetFilter),
        api.budgets.get(token),
        api.budgets.getAll(token)
      ]);

      const expenseData = expensesRes.expenses || [];
    
      setExpenses(expenseData);
      setFilteredExpenses(expenseData);
      setBudget(budgetRes.budget || null);
      setAllBudgets(allBudgetsRes.budgets || []);
    } catch (error) {
      setError('Failed to load budget data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleFilter = async (filters: Record<string, any>) => {
    try {
      setFilterLoading(true);
      // Ensure we only filter budget expenses
      const budgetFilter = { ...filters, trackingMode: 'budget' };
      const expensesRes = await api.expenses.getAll(token, budgetFilter);
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
      // Ensure expense is saved as budget tracking mode
      await api.expenses.create({ 
        ...data, 
        trackingMode: 'budget',
        budgetId: data.budgetId || null
      }, token);
      setSuccess('Expense added successfully!');
      loadBudgetData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.budgets.create({ 
        totalAmount: parseFloat(budgetAmount),
        category: budgetCategory
      }, token);
      loadBudgetData();
      setShowBudgetForm(false);
      setBudgetAmount('');
      setBudgetCategory('');
      setSuccess('Budget created successfully!');
    } catch (error) {
      setError('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const filteredTotal = filteredExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const budgetSpent = budget ? budget.totalAmount - budget.remainingAmount : 0;
  const remainingAmount = budget ? budget.remainingAmount : 0;

  return (
    <div>
      {/* Budget Alerts */}
      {!dataLoading && <BudgetAlert budget={budget} totalSpent={totalSpent} />}

      {/* Overview Cards for Budget Tracking */}
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
              <h3 className="text-lg font-semibold mb-2">Total Budget</h3>
              <p className="text-2xl font-bold text-blue-600">
                ₹{budget?.totalAmount || 0}
              </p>
              {!budget && (
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Set Budget
                </button>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Budget Spent</h3>
              <p className="text-2xl font-bold text-red-600">₹{budgetSpent}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Remaining</h3>
              <p className={`text-2xl font-bold ${
                budget && budget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ₹{remainingAmount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Budget Expenses</h3>
              <p className="text-2xl font-bold text-purple-600">{expenses.length || 0}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseForm 
          onSubmit={handleAddExpense} 
          loading={loading} 
          trackingMode="budget"
          budgets={allBudgets}
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
              <h3 className="text-lg font-semibold">Expense History (Budget Tracking)</h3>
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
                        <th className="text-left p-3">Budget</th>
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
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-gray-400" />
                                {expense.budgetId ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    Budgeted
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                    No Budget
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">
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

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Budget</h3>
            <form onSubmit={handleCreateBudget}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  placeholder="Budget Amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  min="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Category
                </label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Food & Drinks">Food & Drinks</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                  <option value="Investments">Investments</option>
                  <option value="Savings">Savings</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Budget'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}