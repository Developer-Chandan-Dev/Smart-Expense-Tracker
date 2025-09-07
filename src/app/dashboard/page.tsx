'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseChart from '@/components/ExpenseChart';
import ExpenseFilter from '@/components/ExpenseFilter';
import ReportsChart from '@/components/ReportsChart';
import ExpenseStats from '@/components/ExpenseStats';
import BudgetAlert from '@/components/BudgetAlert';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import { RealtimeProvider, useRealtime } from '@/components/RealtimeProvider';
import RealtimeNotification from '@/components/RealtimeNotification';
import RealtimeStatus from '@/components/RealtimeStatus';
import { useSocketInit } from '@/lib/socketInit';
import { FileText, Target, BarChart3, History, PlusCircle, Wallet } from 'lucide-react';
import { api } from '@/lib/api';
import { User, Expense, Budget, ExpenseFormData, ExpenseFilters } from '@/types';

function DashboardContent() {
  const { lastUpdate } = useRealtime();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [freeExpenses, setFreeExpenses] = useState<Expense[]>([]);
  const [budgetExpenses, setBudgetExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [activeMode, setActiveMode] = useState<'overview' | 'free' | 'budget'>('overview');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [filteredFreeExpenses, setFilteredFreeExpenses] = useState<Expense[]>([]);
  const [filteredBudgetExpenses, setFilteredBudgetExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!storedToken || !storedUser) {
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(userData);
      loadDashboardData(storedToken);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth');
    }
  }, [router]);

  const loadDashboardData = async (authToken: string) => {
    try {
      setError('');
      const [freeExpensesRes, budgetExpensesRes, budgetsRes, currentBudgetRes] = await Promise.all([
        api.expenses.getAll(authToken, { trackingMode: 'free' }),
        api.expenses.getAll(authToken, { trackingMode: 'budget' }),
        api.budgets.getAll(authToken),
        api.budgets.get(authToken)
      ]);
      
      const freeData = freeExpensesRes.expenses || [];
      const budgetData = budgetExpensesRes.expenses || [];
      
      setFreeExpenses(freeData);
      setBudgetExpenses(budgetData);
      setFilteredFreeExpenses(freeData);
      setFilteredBudgetExpenses(budgetData);
      setBudgets(budgetsRes.budgets || []);
      setCurrentBudget(currentBudgetRes.budget);
    } catch (error) {
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFreeFilter = async (filters: ExpenseFilters) => {
    try {
      const trackingFilter = { ...filters, trackingMode: 'free' as const };
      const expensesRes = await api.expenses.getAll(token, trackingFilter);
      setFilteredFreeExpenses(expensesRes.expenses || []);
    } catch (error) {
      setError('Failed to filter free expenses.');
    }
  };

  const handleBudgetFilter = async (filters: ExpenseFilters) => {
    try {
      const trackingFilter = { ...filters, trackingMode: 'budget' as const };
      const expensesRes = await api.expenses.getAll(token, trackingFilter);
      setFilteredBudgetExpenses(expensesRes.expenses || []);
    } catch (error) {
      setError('Failed to filter budget expenses.');
    }
  };

  const handleAddFreeExpense = async (data: ExpenseFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const expenseData = { ...data, trackingMode: 'free' as const };
      await api.expenses.create(expenseData, token);
      setSuccess('Free expense added successfully!');
      loadDashboardData(token);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add free expense.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudgetExpense = async (data: ExpenseFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const expenseData = { ...data, trackingMode: 'budget' as const };
      await api.expenses.create(expenseData, token);
      setSuccess('Budget expense added successfully!');
      loadDashboardData(token);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add budget expense.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.budgets.create({ totalAmount: parseFloat(budgetAmount) }, token);
      setSuccess('Budget created successfully!');
      setShowBudgetForm(false);
      setBudgetAmount('');
      loadDashboardData(token);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create budget.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  // Auto-refresh data on real-time updates
  useEffect(() => {
    if (lastUpdate && token) {
      loadDashboardData(token);
    }
  }, [lastUpdate, token]);

  const freeTotal = freeExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const budgetTotal = budgetExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const totalBudgetAmount = budgets.reduce((sum: number, budget: Budget) => sum + budget.totalAmount, 0);
  const budgetUsagePercentage = currentBudget ? (budgetTotal / currentBudget.totalAmount) * 100 : 0;
  const filteredFreeTotal = filteredFreeExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const filteredBudgetTotal = filteredBudgetExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

  if (!user || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RealtimeNotification />
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                Smart Expense Tracker
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <RealtimeStatus />
              <span className="text-gray-600 hidden sm:inline">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Messages */}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

        {/* Mode Selection Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3, color: 'gray' },
              { key: 'free', label: 'Free Tracking', icon: FileText, color: 'blue' },
              { key: 'budget', label: 'Budget Tracking', icon: Target, color: 'green' }
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.key;
              return (
                <button
                  key={mode.key}
                  onClick={() => setActiveMode(mode.key as any)}
                  className={`flex-1 min-w-0 px-4 sm:px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? `border-b-2 border-${mode.color}-600 text-${mode.color}-600 bg-${mode.color}-50`
                      : `text-gray-600 hover:text-${mode.color}-600 hover:bg-gray-50`
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Mode */}
        {activeMode === 'overview' && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Free Expenses</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{freeTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{freeExpenses.length} transactions</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Budget Expenses</h3>
                    <p className="text-2xl font-bold text-green-600">₹{budgetTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{budgetExpenses.length} transactions</p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Budgets</h3>
                    <p className="text-2xl font-bold text-purple-600">₹{totalBudgetAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{budgets.length} budgets</p>
                  </div>
                  <Wallet className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
                    <p className="text-2xl font-bold text-orange-600">₹{(freeTotal + budgetTotal).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{freeExpenses.length + budgetExpenses.length} total</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">📝 Free Tracking</h3>
                <p className="mb-4 text-blue-100">Track expenses without budget constraints</p>
                <button
                  onClick={() => setActiveMode('free')}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Start Free Tracking
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">🎯 Budget Tracking</h3>
                <p className="mb-4 text-green-100">Set budgets and track against limits</p>
                <button
                  onClick={() => setActiveMode('budget')}
                  className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  Start Budget Tracking
                </button>
              </div>
            </div>
          </>
        )}

        {/* Free Tracking Mode */}
        {activeMode === 'free' && (
          <>
            {/* Free Tracking Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">📝 Free Expense Tracking</h2>
              <p className="text-blue-100">Track your expenses without any budget constraints</p>
            </div>

            {/* Free Tracking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
                <p className="text-2xl font-bold text-blue-600">₹{freeTotal.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
                <p className="text-2xl font-bold text-green-600">{freeExpenses.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Average Expense</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{freeExpenses.length > 0 ? (freeTotal / freeExpenses.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">This Month</h3>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{freeExpenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Free Tracking Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="flex border-b">
                {['dashboard', 'reports', 'expenses'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <ExpenseForm 
                    onSubmit={handleAddFreeExpense} 
                    loading={loading} 
                    trackingMode="free"
                    budgets={[]}
                  />
                  {freeExpenses.length > 0 && (
                    <ExpenseChart expenses={freeExpenses} type="pie" />
                  )}
                </div>
                {freeExpenses.length > 0 && (
                  <>
                    <ExpenseChart expenses={freeExpenses} type="bar" />
                    <ExpenseStats expenses={freeExpenses} />
                  </>
                )}
              </>
            )}

            {activeTab === 'reports' && (
              <>
                <ExpenseStats expenses={freeExpenses} />
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Report Type</h3>
                  <div className="flex gap-4">
                    {['daily', 'weekly', 'monthly'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setReportType(type as any)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          reportType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {freeExpenses.length > 0 && (
                  <ReportsChart expenses={freeExpenses} reportType={reportType} />
                )}
              </>
            )}

            {activeTab === 'expenses' && (
              <>
                <ExpenseFilter onFilter={handleFreeFilter} />
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Free Expenses</h3>
                      <div className="text-sm text-gray-600">
                        {filteredFreeExpenses.length} expenses • Total: ₹{filteredFreeTotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
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
                          {filteredFreeExpenses.length > 0 ? (
                            filteredFreeExpenses.map((expense: Expense) => (
                              <tr key={expense._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-gray-400" />
                                    {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    {expense.reason || 'No description'}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-gray-400" />
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                      {expense.category || 'Uncategorized'}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 font-semibold">
                                  <div className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-gray-400" />
                                    ₹{expense.amount ? expense.amount.toFixed(2) : '0.00'}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-8 text-center">
                                <div className="flex flex-col items-center gap-3 text-gray-500">
                                  <FileText className="w-12 h-12 text-gray-300" />
                                  <p className="text-lg font-medium">No free expenses found</p>
                                  <p className="text-sm">Start tracking your expenses without budget limits</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Budget Tracking Mode */}
        {activeMode === 'budget' && (
          <>
            {/* Budget Tracking Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">🎯 Budget Expense Tracking</h2>
              <p className="text-green-100">Track your expenses against set budgets</p>
            </div>

            {/* Budget Alerts */}
            <BudgetAlert budget={currentBudget} totalSpent={budgetTotal} />

            {/* Budget Progress */}
            {currentBudget && (
              <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Budget Progress</h3>
                  <span className="text-sm text-gray-600">{budgetUsagePercentage.toFixed(1)}% used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${
                      budgetUsagePercentage > 90 ? 'bg-red-500' : 
                      budgetUsagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Budget Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
                <p className="text-2xl font-bold text-blue-600">₹{currentBudget?.totalAmount || 0}</p>
                {!currentBudget && (
                  <button
                    onClick={() => setShowBudgetForm(true)}
                    className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Set Budget
                  </button>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Budget Spent</h3>
                <p className="text-2xl font-bold text-red-600">₹{budgetTotal.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
                <p className={`text-2xl font-bold ${
                  currentBudget && currentBudget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ₹{currentBudget ? currentBudget.remainingAmount.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-600">Budget Expenses</h3>
                <p className="text-2xl font-bold text-purple-600">{budgetExpenses.length}</p>
              </div>
            </div>

            {/* Budget Tracking Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-6">
              <div className="flex border-b">
                {['dashboard', 'reports', 'expenses'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <ExpenseForm 
                    onSubmit={handleAddBudgetExpense} 
                    loading={loading} 
                    trackingMode="budget"
                    budgets={budgets}
                  />
                  {budgetExpenses.length > 0 && (
                    <ExpenseChart expenses={budgetExpenses} type="pie" />
                  )}
                </div>
                {budgetExpenses.length > 0 && (
                  <>
                    <ExpenseChart expenses={budgetExpenses} type="bar" />
                    <ExpenseStats expenses={budgetExpenses} />
                  </>
                )}
              </>
            )}

            {activeTab === 'reports' && (
              <>
                <ExpenseStats expenses={budgetExpenses} />
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Report Type</h3>
                  <div className="flex gap-4">
                    {['daily', 'weekly', 'monthly'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setReportType(type as any)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          reportType === type
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {budgetExpenses.length > 0 && (
                  <ReportsChart expenses={budgetExpenses} reportType={reportType} />
                )}
              </>
            )}

            {activeTab === 'expenses' && (
              <>
                <ExpenseFilter onFilter={handleBudgetFilter} />
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Budget Expenses</h3>
                      <div className="text-sm text-gray-600">
                        {filteredBudgetExpenses.length} expenses • Total: ₹{filteredBudgetTotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
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
                          {filteredBudgetExpenses.length > 0 ? (
                            filteredBudgetExpenses.map((expense: Expense) => (
                              <tr key={expense._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-gray-400" />
                                    {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    {expense.reason || 'No description'}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-gray-400" />
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                      {expense.category || 'Uncategorized'}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 font-semibold">
                                  <div className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-gray-400" />
                                    ₹{expense.amount ? expense.amount.toFixed(2) : '0.00'}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-8 text-center">
                                <div className="flex flex-col items-center gap-3 text-gray-500">
                                  <Target className="w-12 h-12 text-gray-300" />
                                  <p className="text-lg font-medium">No budget expenses found</p>
                                  <p className="text-sm">Start tracking expenses against your budget</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Budget Form Modal */}
        {showBudgetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-green-600" />
                Create Budget
              </h3>
              <form onSubmit={handleCreateBudget}>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Budget Amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Budget'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBudgetForm(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [token, setToken] = useState('');
  const router = useRouter();
  
  useSocketInit();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/auth');
      return;
    }
    setToken(storedToken);
  }, [router]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <RealtimeProvider token={token}>
      <DashboardContent />
    </RealtimeProvider>
  );
}