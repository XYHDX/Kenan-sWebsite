'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/config/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
// import useTheme from '@/hooks/useTheme'; // Commented out as currentTheme is unused
// import useLocalStorage from '@/hooks/useLocalStorage'; // Remove this if settings are unused

const Header = () => {
  // Remove the useLocalStorage hook call if settings are not used in this component
  // const [settings, _, isLoadingSettings] = useLocalStorage<SiteSettings>(
  //   'siteSettings', // Or STORAGE_KEYS.SETTINGS if defined
  //   {
  //     // Default settings if needed, otherwise remove the hook call entirely
  //   }
  // );
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-theme-primary" onClick={closeMenu}>
          Kenan Younes Saoud
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {/* Desktop Navigation */}
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-theme-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 hover:text-theme-primary focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-theme-primary transition-colors py-2"
                onClick={toggleMenu} // Close menu on link click
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Theme Switcher */}
            <div className="py-2">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
