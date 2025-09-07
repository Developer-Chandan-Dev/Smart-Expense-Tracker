'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense, ChartData } from '@/types';

interface ReportsChartProps {
  expenses: Expense[];
  reportType: 'daily' | 'weekly' | 'monthly';
}

export default function ReportsChart({ expenses, reportType }: ReportsChartProps) {
  const generateReportData = (): ChartData[] => {
    const data: Record<string, ChartData> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      let key = '';
      
      if (reportType === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (reportType === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!data[key]) {
        data[key] = { name: key, value: 0, amount: 0, count: 0 };
      }
      
      data[key].amount = (data[key].amount || 0) + expense.amount;
      data[key].count = (data[key].count || 0) + 1;
    });
    
    return Object.values(data).sort((a, b) => a.name.localeCompare(b.name));
  };

  const chartData = generateReportData();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'amount' ? `₹${value}` : value,
              name === 'amount' ? 'Total Amount' : 'Number of Expenses'
            ]}
          />
          <Bar dataKey="amount" fill="#8884d8" name="amount" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Total Periods</p>
          <p className="text-lg font-semibold">{chartData.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-lg font-semibold">
            ₹{chartData.reduce((sum: number, item) => sum + (item.amount || 0), 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-lg font-semibold">
            {chartData.reduce((sum: number, item) => sum + (item.count || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
}