// components/ExpenseTable.tsx
'use client';

import { FileX, Target } from 'lucide-react';
import DataTable, { ExpenseColumns, BudgetExpenseColumns } from './DataTable';
import { Expense } from '@/types';

interface ExpenseTableProps {
  expenses: Expense[];
  trackingMode: 'free' | 'budget';
  loading?: boolean;
  title?: string;
  totalAmount?: number;
}

export default function ExpenseTable({ 
  expenses, 
  trackingMode, 
  loading = false, 
  title = "Expense History",
  totalAmount = 0
}: ExpenseTableProps) {
  
  const columns = trackingMode === 'budget' ? BudgetExpenseColumns : ExpenseColumns;
  
  const emptyIcon = trackingMode === 'budget' 
    ? <Target className="w-12 h-12 text-gray-300" />
    : <FileX className="w-12 h-12 text-gray-300" />;
    
  const emptyMessage = trackingMode === 'budget' 
    ? "No budget expenses found"
    : "No free expenses found";
    
  const emptyDescription = trackingMode === 'budget'
    ? "Start tracking expenses against your budget"
    : "Add your first expense to get started";

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title} ({trackingMode === 'budget' ? 'Budget' : 'Free'} Tracking)</h3>
        {!loading && expenses.length > 0 && (
          <div className="text-sm text-gray-600">
            Showing {expenses.length} expenses • Total: ₹{totalAmount.toFixed(2)}
          </div>
        )}
      </div>
      
      <DataTable
        data={expenses}
        columns={columns}
        loading={loading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon}
      />
    </div>
  );
}