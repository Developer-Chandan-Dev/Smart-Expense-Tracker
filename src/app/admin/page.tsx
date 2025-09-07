'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Shield, Calendar, Trash2, UserX } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!storedToken || !storedUser) {
      router.push('/auth');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setToken(storedToken);
    setUser(userData);
    loadAnalytics(storedToken);
    loadUsers(storedToken);
  }, []);

  const loadAnalytics = async (authToken: string) => {
    try {
      const result = await api.admin.getAnalytics(authToken);
      setAnalytics(result);
    } catch (error) {
      console.error('Failed to load analytics');
    }
  };

  const loadUsers = async (authToken: string) => {
    try {
      const result = await api.users.getAll(authToken);
      setUsers(result.users || []);
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      await api.users.delete(userId, token);
      loadUsers(token);
      loadAnalytics(token);
    } catch (error) {
      console.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  if (!user || !analytics) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {['analytics', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <h2 className="text-2xl font-bold mb-6">System Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.totalExpenses}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Active Users (7 days)</h3>
                <p className="text-3xl font-bold text-purple-600">{analytics.activeUsers7Days}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Active Users (30 days)</h3>
                <p className="text-3xl font-bold text-orange-600">{analytics.activeUsers30Days}</p>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Total Expense Amount</h3>
              <p className="text-4xl font-bold text-red-600">₹{analytics.totalExpenseAmount}</p>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="text-sm text-gray-600">
                Total Users: {users.length}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Last Login</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((userData: User) => (
                          <tr key={userData._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                {userData.name || 'N/A'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {userData.email || 'N/A'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                  userData.role === 'admin' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {userData.role || 'user'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {userData.lastLogin 
                                  ? new Date(userData.lastLogin).toLocaleDateString()
                                  : 'Never'
                                }
                              </div>
                            </td>
                            <td className="p-3">
                              {userData.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(userData._id)}
                                  disabled={loading}
                                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center">
                            <div className="flex flex-col items-center gap-3 text-gray-500">
                              <UserX className="w-12 h-12 text-gray-300" />
                              <p className="text-lg font-medium">No users found</p>
                              <p className="text-sm">No users have registered yet</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}