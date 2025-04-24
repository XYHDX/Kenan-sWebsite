'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Save, 
  Globe, 
  Moon, 
  Shield, 
  Eye, 
  ArrowUpDown,
  Image as ImageIcon 
} from 'lucide-react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  enableDarkMode: boolean;
  enablePublicProfile: boolean;
  enableSEO: boolean;
  maintenanceMode: boolean;
  customTheme: string;
  maxItemsPerPage: number;
}

// Moved outside the component
const defaultSettings: SiteSettings = {
  siteName: 'Yahya Demeriah - Portfolio',
  siteDescription: 'Personal portfolio and CV for Yahya Demeriah, IT Engineer & Robotics Specialist',
  siteLanguage: 'en',
  enableDarkMode: true,
  enablePublicProfile: true,
  enableSEO: true,
  maintenanceMode: false,
  customTheme: 'blue',
  maxItemsPerPage: 10
};

const SettingsPage = () => {
  const [formData, setFormData] = useState<SiteSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load settings on initial render
  useEffect(() => {
    const savedSettings = getFromLocalStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
    setFormData(savedSettings);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Handle different input types
    const newValue = type === 'checkbox' 
      ? checked 
      : type === 'number' 
        ? parseInt(value, 10) 
        : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // In a real implementation, this would make an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for persistence
      saveToLocalStorage(STORAGE_KEYS.SETTINGS, formData);
      
      setSaveMessage('Settings updated successfully!');
    } catch {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activePage="settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600">Configure your website settings and preferences</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center text-gray-900">
              <Globe size={18} className="mr-2 text-blue-600 " />
              General Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="siteLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Language
                  </label>
                  <select
                    id="siteLanguage"
                    name="siteLanguage"
                    value={formData.siteLanguage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="customTheme" className="block text-sm font-medium text-gray-700 mb-1">
                    Color Theme
                  </label>
                  <ThemeSwitcher className="w-full" />
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows={4}
                    value={formData.siteDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="maxItemsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                    Items Per Page
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="maxItemsPerPage"
                      name="maxItemsPerPage"
                      min="5"
                      max="50"
                      value={formData.maxItemsPerPage}
                      onChange={handleChange}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />
                    <ArrowUpDown size={18} className="ml-2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Display Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 flex items-center">
              <ImageIcon size={18} className="mr-2 text-blue-600" />
              Display Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableDarkMode"
                  name="enableDarkMode"
                  checked={formData.enableDarkMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableDarkMode" className="ml-2 text-gray-700 flex items-center">
                  Enable Dark Mode <Moon size={16} className="ml-1 text-gray-500" />
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enablePublicProfile"
                  name="enablePublicProfile"
                  checked={formData.enablePublicProfile}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enablePublicProfile" className="ml-2 text-gray-700 flex items-center">
                  Make Profile Public <Eye size={16} className="ml-1 text-gray-500" />
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableSEO"
                  name="enableSEO"
                  checked={formData.enableSEO}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableSEO" className="ml-2 text-gray-700">
                  Enable SEO Optimization
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="maintenanceMode" className="ml-2 text-gray-700 flex items-center">
                  Maintenance Mode <Shield size={16} className="ml-1 text-gray-500" />
                </label>
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
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 