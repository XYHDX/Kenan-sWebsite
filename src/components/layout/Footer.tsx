'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                <a href="mailto:yahyademeriah@gmail.com" className="hover:text-blue-400 transition-colors">
                  yahyademeriah@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                <a href="tel:+971581277542" className="hover:text-blue-400 transition-colors">
                  +971 58 127 7542
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span>Dubai, UAE</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-blue-400 transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-blue-400 transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/yahya-demeriah" 
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/XYHDX" 
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Yahya Demeriah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
