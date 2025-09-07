// components/RealtimeNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { Bell, DollarSign, Target, X } from 'lucide-react';
import { useRealtime } from './RealtimeProvider';

export default function RealtimeNotification() {
  const { lastUpdate } = useRealtime();
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    if (lastUpdate) {
      setNotification(lastUpdate);
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  if (!notification) return null;

  const getNotificationContent = () => {
    switch (notification.type) {
      case 'expense_added':
        return {
          icon: <DollarSign className="w-5 h-5 text-green-600" />,
          title: 'Expense Added',
          message: `₹${notification.data.expense.amount} - ${notification.data.expense.reason}`,
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'budget_updated':
        return {
          icon: <Target className="w-5 h-5 text-blue-600" />,
          title: 'Budget Updated',
          message: `Remaining: ₹${notification.data.budget.remainingAmount}`,
          bgColor: 'bg-blue-50 border-blue-200'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-gray-600" />,
          title: 'Update',
          message: 'Something changed',
          bgColor: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const content = getNotificationContent();

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border shadow-lg ${content.bgColor} animate-slide-in`}>
      <div className="flex items-center gap-3">
        {content.icon}
        <div className="flex-1">
          <p className="font-medium text-sm">{content.title}</p>
          <p className="text-xs text-gray-600">{content.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}