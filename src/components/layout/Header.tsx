'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/config/navigation';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Image 
            src="/images/profile-pic.png" 
            alt="Kenan Younes Saoud" 
            width={50} 
            height={50} 
            className="rounded-full"
          />
        </Link>

        <div className="hidden md:flex items-center">
          {/* Desktop Navigation */}
          <nav className="flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`transition-colors ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary focus:outline-none"
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
                className={`py-2 transition-colors ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
