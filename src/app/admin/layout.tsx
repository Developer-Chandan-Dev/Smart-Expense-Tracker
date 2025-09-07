import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - User Management & Analytics',
  description: 'Administrative dashboard for managing users and viewing system analytics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}