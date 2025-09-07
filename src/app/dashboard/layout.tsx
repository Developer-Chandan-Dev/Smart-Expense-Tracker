import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Expense Tracking & Budget Management',
  description: 'Manage your expenses and budgets with real-time analytics. Track spending patterns and achieve financial goals.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}