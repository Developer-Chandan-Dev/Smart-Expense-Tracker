// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

// Expense Types
export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  reason: string;
  category: string;
  trackingMode: 'free' | 'budget';
  budgetId?: string;
  date: string;
  createdAt: string;
}

// Budget Types
export interface Budget {
  _id: string;
  userId: string;
  totalAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
}

// Form Data Types
export interface ExpenseFormData {
  amount: string;
  reason: string;
  category: string;
  date: string;
  trackingMode: 'free' | 'budget';
  budgetId?: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

// Filter Types
export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  trackingMode?: 'free' | 'budget';
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  period?: string;
  amount?: number;
  count?: number;
}