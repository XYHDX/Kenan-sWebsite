'use client';

import { useState, useEffect } from 'react';
import { Book, Save, Trash2, Plus, X, Info } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { STORAGE_KEYS } from '@/lib/localStorage';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Publication {
  id: string | number;
  title: string;
  description?: string;
  year?: string | number;
  authors?: string[];
  pdfUrl?: string;
}

interface ApiResponse {
  message?: string;
  success?: boolean;
  error?: string;
}

export default function AdminPublicationsPage() {
  // State for publications data
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  
  // Use localStorage as fallback for initial data
  const [localPublications] = useLocalStorage<Publication[]>(
    STORAGE_KEYS.PUBLICATIONS, 
    []
  );
  
  // New publication form state
  const [newPublication, setNewPublication] = useState<Partial<Publication>>({
    title: '',
    year: new Date().getFullYear(),
    description: ''
  });
  
  // Fetch publications data
  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/publications', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json() as Publication[];
          setPublications(data);
        } else {
          // Fallback to localStorage
          console.error('Failed to fetch publications data from API');
          setPublications(localPublications);
        }
      } catch (error) {
        console.error('Error fetching publications data:', error);
        setPublications(localPublications);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPublications();
  }, [localPublications]);
  
  // Save publications data
  const savePublications = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publications),
      });
      
      if (response.ok) {
        const result = await response.json() as ApiResponse;
        setSaveStatus({ 
          success: true, 
          message: result.message || 'Publications saved successfully!' 
        });
      } else {
        const errorData = await response.json() as ApiResponse;
        setSaveStatus({ 
          success: false, 
          message: errorData.error || 'Failed to save publications.' 
        });
      }
    } catch (error) {
      console.error('Error saving publications:', error);
      setSaveStatus({ 
        success: false, 
        message: 'Error saving publications. Please try again.' 
      });
    } finally {
      setIsSaving(false);
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSaveStatus({ success: false, message: '' });
      }, 5000);
    }
  };
  
  // Add new publication
  const addPublication = () => {
    if (!newPublication.title) {
      setSaveStatus({
        success: false,
        message: 'Publication title is required'
      });
      return;
    }
    
    const id = Date.now().toString();
    const publicationToAdd = {
      ...newPublication,
      id
    } as Publication;
    
    setPublications([...publications, publicationToAdd]);
    
    // Reset form
    setNewPublication({
      title: '',
      year: new Date().getFullYear(),
      description: ''
    });
    
    setSaveStatus({
      success: true,
      message: 'Publication added. Don\'t forget to save changes!'
    });
  };
  
  // Remove publication
  const removePublication = (id: string | number) => {
    setPublications(publications.filter(pub => pub.id !== id));
    setSaveStatus({
      success: true,
      message: 'Publication removed. Don\'t forget to save changes!'
    });
  };
  
  // Update publication field
  const updatePublicationField = (id: string | number, field: keyof Publication, value: any) => {
    setPublications(
      publications.map(pub => 
        pub.id === id ? { ...pub, [field]: value } : pub
      )
    );
  };
  
  return (
    <AdminLayout activePage="publications">
      <div className="flex items-center mb-6">
        <Book className="w-6 h-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Publications</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Status Messages */}
        {saveStatus.message && (
          <div className={`mb-4 p-3 rounded-md ${saveStatus.success ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{saveStatus.message}</p>
            </div>
          </div>
        )}
        
        {/* Add New Publication Form */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Publication</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title*
              </label>
              <input
                type="text"
                value={newPublication.title}
                onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Publication title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              <input
                type="number"
                value={newPublication.year}
                onChange={(e) => setNewPublication({...newPublication, year: e.target.value})}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Publication year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newPublication.description}
                onChange={(e) => setNewPublication({...newPublication, description: e.target.value})}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Brief description of the publication"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PDF URL (optional)
              </label>
              <input
                type="text"
                value={newPublication.pdfUrl || ''}
                onChange={(e) => setNewPublication({...newPublication, pdfUrl: e.target.value})}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Link to PDF document"
              />
            </div>
            <div className="pt-2">
              <button
                onClick={addPublication}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </button>
            </div>
          </div>
        </div>
        
        {/* Publications List */}
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Book className="h-5 w-5 mr-2" />
          Publications List
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No publications found. Add your first publication above.
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {publications.map((publication) => (
              <div key={publication.id} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between">
                  <div className="flex-grow mr-4">
                    <input
                      type="text"
                      value={publication.title}
                      onChange={(e) => updatePublicationField(publication.id, 'title', e.target.value)}
                      className="w-full p-2 mb-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-4">
                      <div className="w-1/4">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year</label>
                        <input
                          type="text"
                          value={publication.year || ''}
                          onChange={(e) => updatePublicationField(publication.id, 'year', e.target.value)}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                      </div>
                      <div className="w-3/4">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">PDF URL</label>
                        <input
                          type="text"
                          value={publication.pdfUrl || ''}
                          onChange={(e) => updatePublicationField(publication.id, 'pdfUrl', e.target.value)}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                      <textarea
                        value={publication.description || ''}
                        onChange={(e) => updatePublicationField(publication.id, 'description', e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removePublication(publication.id)}
                    className="self-start p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete publication"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={savePublications}
            disabled={isLoading || isSaving}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
} 