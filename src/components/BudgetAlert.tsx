// components/BudgetAlert.tsx
'use client';

import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Budget } from '@/types';

interface BudgetAlertProps {
  budget: Budget | null;
  totalSpent: number;
}

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * @description
   * A component that renders a warning if the current expense exceeds the budget or is close to depleting it.
   * @param budget The budget data
   * @param totalSpent The total amount already spent
/*******  4425892c-5ca4-41cb-a633-c58acdb7b1b1  *******/
export default function BudgetAlert({ budget, totalSpent }: BudgetAlertProps) {
  if (!budget) return null;

  const remainingPercentage = (budget.remainingAmount / budget.totalAmount) * 100;
  const isCloseToLimit = remainingPercentage < 10 && remainingPercentage > 0;
  const isExceeded = budget.remainingAmount < 0;

  if (!isCloseToLimit && !isExceeded) return null;

  return (
    <div className={`p-4 rounded-lg mb-6 ${
      isExceeded ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      <div className="flex items-start gap-3">
        {isExceeded ? (
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <h3 className="font-semibold">
            {isExceeded ? 'Budget Exceeded!' : 'Budget Almost Depleted!'}
          </h3>
          <p className="text-sm mt-1">
            {isExceeded 
              ? `You've exceeded your budget by ₹${Math.abs(budget.remainingAmount).toFixed(2)}.`
              : `Only ${remainingPercentage.toFixed(1)}% (₹${budget.remainingAmount.toFixed(2)}) left in your budget.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}