import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Login & Register',
  description: 'Secure login and registration for Smart Expense Tracker. Access your financial dashboard with JWT authentication.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}