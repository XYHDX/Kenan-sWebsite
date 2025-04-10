'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Home, Briefcase, GraduationCap, BarChart, Trophy, Mail, Settings } from 'lucide-react';

const AdminSidebar = ({ activePage }: { activePage: string }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { name: 'Profile', icon: <User size={20} />, path: '/admin/profile' },
    { name: 'Experience', icon: <Briefcase size={20} />, path: '/admin/experience' },
    { name: 'Education', icon: <GraduationCap size={20} />, path: '/admin/education' },
    { name: 'Skills', icon: <BarChart size={20} />, path: '/admin/skills' },
    { name: 'Achievements', icon: <Trophy size={20} />, path: '/admin/achievements' },
    { name: 'Contact', icon: <Mail size={20} />, path: '/admin/contact' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className={`bg-gray-900 text-white h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className={`font-bold text-xl ${collapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-grow py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.path}
                className={`flex items-center px-4 py-3 ${
                  activePage === item.name.toLowerCase() 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } transition-colors rounded-lg mx-2`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className={collapsed ? 'hidden' : 'block'}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/admin/logout"
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span className={collapsed ? 'hidden' : 'block'}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
