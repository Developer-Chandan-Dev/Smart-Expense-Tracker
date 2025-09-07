'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, FileText, Tag, Calendar, Target, Plus } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { ExpenseFormData, Budget } from '@/types';

const categories = [
  { value: "Food & Drinks", icon: "🍽️" },
  { value: "Shopping", icon: "🛍️" },
  { value: "Transport", icon: "🚗" },
  { value: "Bills & Utilities", icon: "💡" },
  { value: "Rent", icon: "🏠" },
  { value: "Healthcare", icon: "🏥" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Travel", icon: "✈️" },
  { value: "Education", icon: "📚" },
  { value: "Investments", icon: "📈" },
  { value: "Savings", icon: "💰" },
  { value: "Other", icon: "📝" }
];

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  loading: boolean;
  trackingMode: 'free' | 'budget';
  budgets: Budget[];
}

export default function ExpenseForm({ onSubmit, loading, trackingMode, budgets }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    budgetId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Set default budget when budgets change
  useEffect(() => {
    if (trackingMode === 'budget' && budgets.length > 0 && !formData.budgetId) {
      setFormData(prev => ({
        ...prev,
        budgetId: budgets[0]._id
      }));
    }
  }, [budgets, trackingMode, formData.budgetId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Description is required';
    }

    if (trackingMode === 'budget' && !formData.budgetId) {
      newErrors.budgetId = 'Please select a budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({
        amount: true,
        reason: true,
        category: true,
        date: true,
        budgetId: true
      });
      return;
    }

    onSubmit({
      ...formData,
      trackingMode,
      budgetId: trackingMode === 'budget' ? formData.budgetId : undefined
    });
    
    // Reset form but keep the same budget selection
    setFormData({
      amount: '',
      reason: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      budgetId: formData.budgetId, // Keep the same budget selected
    });
    
    // Reset touched fields
    setTouched({});
  };

  const isBudgetDisabled = trackingMode === 'budget' && budgets.length === 0;
  const isSubmitDisabled = loading || isBudgetDisabled;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Expense
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            trackingMode === 'free' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {trackingMode === 'free' ? '📝 Free' : '🎯 Budget'}
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5" noValidate>
        {/* Amount and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.amount && touched.amount 
                    ? 'border-red-500 ring-1 ring-red-500' 
                    : 'border-gray-300'
                }`}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                onBlur={() => handleBlur('amount')}
                disabled={loading}
              />
            </div>
            {errors.amount && touched.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                onBlur={() => handleBlur('date')}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              onBlur={() => handleBlur('category')}
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Selection for Budget Mode */}
        {trackingMode === 'budget' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Select Budget</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none ${
                  errors.budgetId && touched.budgetId 
                    ? 'border-red-500 ring-1 ring-red-500' 
                    : 'border-gray-300'
                } ${isBudgetDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                value={formData.budgetId}
                onChange={(e) => setFormData({ ...formData, budgetId: e.target.value })}
                onBlur={() => handleBlur('budgetId')}
                disabled={loading || isBudgetDisabled}
                required={trackingMode === 'budget'}
              >
                {budgets.length === 0 ? (
                  <option value="">No budgets available</option>
                ) : (
                  <>
                    <option value="">Select a budget</option>
                    {budgets.map((budget) => (
                      <option key={budget._id} value={budget._id}>
                        {budget.category ? `${budget.category} - ` : ''}
                        ₹{budget.totalAmount} (Remaining: ₹{Math.max(0, budget.remainingAmount)})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            {errors.budgetId && touched.budgetId && (
              <p className="text-red-500 text-xs mt-1">{errors.budgetId}</p>
            )}
            {isBudgetDisabled && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                Please create a budget first to use budget tracking.
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              placeholder="What did you spend on?"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.reason && touched.reason 
                  ? 'border-red-500 ring-1 ring-red-500' 
                  : 'border-gray-300'
              }`}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              onBlur={() => handleBlur('reason')}
              disabled={loading}
            />
          </div>
          {errors.reason && touched.reason && (
            <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>

        {isBudgetDisabled && (
          <p className="text-sm text-red-600 text-center">
            Cannot add expenses in budget mode without any budgets
          </p>
        )}
      </form>
    </div>
  );
}