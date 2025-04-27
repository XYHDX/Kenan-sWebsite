'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Mail, Phone, MapPin, Save, Link as LinkIcon } from 'lucide-react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface ContactFormData {
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  showContactForm: boolean;
  emailNotifications: boolean;
}

// Moved outside the component
const defaultContactData: ContactFormData = {
  email: 'yahyademeriah@gmail.com',
  phone: '+971 58 127 7542',
  location: 'Dubai, UAE',
  linkedinUrl: 'https://linkedin.com/in/yahyademeriah',
  githubUrl: 'https://github.com/yahyademeriah',
  showContactForm: true,
  emailNotifications: true
};

const ContactEditor = () => {
  const [formData, setFormData] = useState<ContactFormData>(defaultContactData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First try to get data from Redis, then fallback to localStorage
    const fetchContactData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first
        const response = await fetch('/api/admin/contact');
        if (response.ok) {
          const apiData = await response.json() as ContactFormData;
          setFormData(apiData);
          // Also update localStorage to keep them in sync
          saveToLocalStorage(STORAGE_KEYS.CONTACT, apiData);
        } else {
          // If API fails, fall back to localStorage
          const savedData = getFromLocalStorage<ContactFormData>(STORAGE_KEYS.CONTACT, defaultContactData);
          setFormData(savedData);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        // Fall back to localStorage if API call fails
        const savedData = getFromLocalStorage<ContactFormData>(STORAGE_KEYS.CONTACT, defaultContactData);
        setFormData(savedData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Save to localStorage for immediate UI update
      saveToLocalStorage(STORAGE_KEYS.CONTACT, formData);
      
      // Also save to Redis through API
      const response = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSaveMessage('Contact information updated successfully!');
      } else {
        const data = await response.json() as { error?: string };
        setSaveMessage(`Error: ${data.error || 'Failed to save to server. Data saved locally only.'}`);
      }
    } catch (err) {
      console.error('Error saving contact data:', err);
      setSaveMessage('An error occurred while saving to server. Data saved locally only.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout activePage="contact">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="contact">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-600">Manage your contact details and social media links</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Your location"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showContactForm"
                    name="showContactForm"
                    checked={formData.showContactForm}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showContactForm" className="ml-2 text-gray-700">
                    Show contact form on website
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 text-gray-700">
                    Receive email notifications for new messages
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-6 py-2 rounded-md text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ContactEditor;
