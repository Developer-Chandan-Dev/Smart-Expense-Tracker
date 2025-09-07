// components/DataTable.tsx
'use client';

import { ReactNode } from 'react';
import { FileX, Calendar, DollarSign, Tag, Wallet, Users, Mail, Shield, Trash2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Column {
  key: string;
  label: string;
  icon?: ReactNode;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
}

export default function DataTable({ 
  data, 
  columns, 
  loading = false, 
  emptyMessage = "No data found",
  emptyDescription = "No items to display",
  emptyIcon = <FileX className="w-12 h-12 text-gray-300" />
}: DataTableProps) {
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="py-12 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="text-left p-3 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      {column.icon}
                      {column.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={row._id || row.id || index} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {column.render ? (
                          column.render(row[column.key], row)
                        ) : (
                          <div className="flex items-center gap-2">
                            {column.icon}
                            {row[column.key] || 'N/A'}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      {emptyIcon}
                      <p className="text-lg font-medium">{emptyMessage}</p>
                      <p className="text-sm">{emptyDescription}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Predefined column configurations for common use cases
export const ExpenseColumns = [
  {
    key: 'date',
    label: 'Date',
    icon: <Calendar className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        {value ? new Date(value).toLocaleDateString() : 'N/A'}
      </div>
    )
  },
  {
    key: 'reason',
    label: 'Description',
    icon: <FileX className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <FileX className="w-4 h-4 text-gray-400" />
        {value || 'No description'}
      </div>
    )
  },
  {
    key: 'category',
    label: 'Category',
    icon: <Tag className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-400" />
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {value || 'Uncategorized'}
        </span>
      </div>
    )
  },
  {
    key: 'amount',
    label: 'Amount',
    icon: <DollarSign className="w-4 h-4 text-gray-400" />,
    render: (value: number) => (
      <div className="flex items-center gap-2 font-semibold">
        <DollarSign className="w-4 h-4 text-gray-400" />
        ₹{value ? value.toFixed(2) : '0.00'}
      </div>
    )
  }
];

export const BudgetExpenseColumns = [
  ...ExpenseColumns,
  {
    key: 'budgetId',
    label: 'Budget',
    icon: <Wallet className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-gray-400" />
        {value ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Budgeted
          </span>
        ) : (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            No Budget
          </span>
        )}
      </div>
    )
  }
];

export const UserColumns = [
  {
    key: 'name',
    label: 'Name',
    icon: <Users className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2 font-medium">
        <Users className="w-4 h-4 text-gray-400" />
        {value || 'N/A'}
      </div>
    )
  },
  {
    key: 'email',
    label: 'Email',
    icon: <Mail className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-gray-400" />
        {value || 'N/A'}
      </div>
    )
  },
  {
    key: 'role',
    label: 'Role',
    icon: <Shield className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-gray-400" />
        <span className={`px-2 py-1 rounded-full text-sm ${
          value === 'admin' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value || 'user'}
        </span>
      </div>
    )
  },
  {
    key: 'createdAt',
    label: 'Joined',
    icon: <Calendar className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        {value ? new Date(value).toLocaleDateString() : 'N/A'}
      </div>
    )
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    icon: <Calendar className="w-4 h-4 text-gray-400" />,
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        {value ? new Date(value).toLocaleDateString() : 'Never'}
      </div>
    )
  }
];