'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
}

const AdminLayout = ({ children, activePage }: AdminLayoutProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settings] = useLocalStorage(STORAGE_KEYS.SETTINGS, {
    customTheme: 'blue',
  });
  
  // Force re-render when theme changes
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    // Force component re-render when theme changes
    forceUpdate({});
  }, [settings.customTheme]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar activePage={activePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h1>
            
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-theme-primary flex items-center" target="_blank">
                <span className="mr-1">View Site</span>
                <ExternalLink size={16} />
              </Link>
              
              <button className="text-gray-600 dark:text-gray-300 hover:text-theme-primary">
                <Bell size={20} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center text-theme-primary-text">
                    <User size={16} />
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/admin/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/admin/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      href="/admin/logout" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dr. Kenan Younes Saoud. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
