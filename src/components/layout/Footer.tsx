'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/localStorage';
import useLocalStorage from '@/hooks/useLocalStorage';
import { navLinks } from '@/config/navigation';

interface ContactData {
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  instagramUrl: string;
}

const Footer = () => {
  // Default contact data
  const defaultContactData: ContactData = {
    email: 'kenan.saoud@outlook.com',
    phone: '09639666005656',
    location: 'Damascus, Syria',
    linkedinUrl: 'https://linkedin.com/in/Kenan.saoud',
    instagramUrl: 'https://instagram.com/Kenan.saoud'
  };

  // Use our custom hook to get contact data from localStorage as fallback
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localContactData, , isLocalLoading] = useLocalStorage<ContactData>(
    STORAGE_KEYS.CONTACT, 
    defaultContactData
  );
  
  // State for API data
  const [contactData, setContactData] = useState<ContactData>(defaultContactData);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contact data from API
  useEffect(() => {
    const fetchContactData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/contact/data');
        if (response.ok) {
          const data = await response.json() as ContactData;
          setContactData({
            ...data,
            linkedinUrl: data.linkedinUrl || defaultContactData.linkedinUrl,
            instagramUrl: data.instagramUrl || defaultContactData.instagramUrl
          });
        } else {
          // Fallback to localStorage if API fails
          setContactData(localContactData);
        }
      } catch (error) {
        console.error('Error fetching contact data for footer:', error);
        // Fallback to localStorage if API fails
        setContactData(localContactData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [localContactData]);

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-theme-primary" />
                <a href={`mailto:${contactData.email}`} className="hover:text-theme-primary transition-colors">
                  {contactData.email}
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-theme-primary" />
                <a href={`tel:${contactData.phone}`} className="hover:text-theme-primary transition-colors">
                  {contactData.phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-theme-primary" />
                <span>{contactData.location}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-theme-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href={contactData.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-theme-primary p-3 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={contactData.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-theme-primary p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kenan Younes Saoud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
