'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Yahya Demeriah
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/experience" className="text-gray-700 hover:text-blue-600 transition-colors">
            Experience
          </Link>
          <Link href="/education" className="text-gray-700 hover:text-blue-600 transition-colors">
            Education
          </Link>
          <Link href="/skills" className="text-gray-700 hover:text-blue-600 transition-colors">
            Skills
          </Link>
          <Link href="/achievements" className="text-gray-700 hover:text-blue-600 transition-colors">
            Achievements
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              href="/experience" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Experience
            </Link>
            <Link 
              href="/education" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Education
            </Link>
            <Link 
              href="/skills" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Skills
            </Link>
            <Link 
              href="/achievements" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Achievements
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
