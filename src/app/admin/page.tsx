'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Clock, Users, Eye, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  // In a real implementation, this data would come from an API
  const stats = [
    { title: 'Last Updated', value: 'April 9, 2025', icon: <Clock size={24} className="text-blue-600" /> },
    { title: 'Total Sections', value: '7', icon: <Users size={24} className="text-green-600" /> },
    { title: 'Site Views', value: '0', icon: <Eye size={24} className="text-purple-600" /> },
  ];

  const recentUpdates = [
    { section: 'Profile', date: 'April 9, 2025', status: 'Created' },
    { section: 'Experience', date: 'April 9, 2025', status: 'Created' },
    { section: 'Education', date: 'April 9, 2025', status: 'Created' },
  ];

  return (
    <AdminLayout activePage="dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600">Manage and update your CV website content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">{stat.title}</h2>
              {stat.icon}
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/admin/profile" 
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Edit Profile</span>
              <ArrowUp size={16} className="transform rotate-45" />
            </Link>
            <Link 
              href="/admin/experience" 
              className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Update Experience</span>
              <ArrowUp size={16} className="transform rotate-45" />
            </Link>
            <Link 
              href="/admin/skills" 
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Manage Skills</span>
              <ArrowUp size={16} className="transform rotate-45" />
            </Link>
            <Link 
              href="/admin/achievements" 
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg flex items-center justify-between transition-colors"
            >
              <span>Add Achievements</span>
              <ArrowUp size={16} className="transform rotate-45" />
            </Link>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUpdates.map((update, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {update.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {update.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
