'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
}

const AdminLayout = ({ children, activePage }: AdminLayoutProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activePage={activePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h1>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600 flex items-center" target="_blank">
                <span className="mr-1">View Site</span>
                <ExternalLink size={16} />
              </Link>
              
              <button className="text-gray-600 hover:text-blue-600">
                <Bell size={20} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      href="/admin/logout" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
