'use client';

import { FileText, Target } from 'lucide-react';

interface TrackingModeSelectorProps {
  mode: 'free' | 'budget';
  onModeChange: (mode: 'free' | 'budget') => void;
}

export default function TrackingModeSelector({ mode, onModeChange }: TrackingModeSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Choose Tracking Mode</h3>
        <p className="text-purple-100 text-sm mt-1">Select how you want to track your expenses</p>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onModeChange('free')}
            className={`p-4 sm:p-5 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
              mode === 'free'
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-lg mr-3 ${
                mode === 'free' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-5 h-5 ${
                  mode === 'free' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <h4 className="font-semibold text-base">Free Tracking</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Track expenses without limits. Perfect for analyzing spending patterns and discovering habits.
            </p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              No budget required
            </div>
          </button>

          <button
            onClick={() => onModeChange('budget')}
            className={`p-4 sm:p-5 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
              mode === 'budget'
                ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                : 'border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-lg mr-3 ${
                mode === 'budget' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Target className={`w-5 h-5 ${
                  mode === 'budget' ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <h4 className="font-semibold text-base">Budget Tracking</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Set spending limits and get alerts. Stay on track with your financial goals.
            </p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Budget alerts included
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}