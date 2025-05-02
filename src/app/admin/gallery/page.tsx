'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Camera, Plus, Trash2, Edit, Save, X, Upload, AlertCircle } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  beforeImagePath: string;
  afterImagePath: string;
  date?: string;
}

const MAX_GALLERY_ITEMS = 6; // Maximum number of cases allowed

const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    beforeImagePath: '/images/profile-pic.png', // Default image
    afterImagePath: '/images/profile-pic.png', // Default image
    date: new Date().toISOString().split('T')[0]
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<{before: boolean, after: boolean}>({before: false, after: false});
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const editBeforeFileInputRef = useRef<HTMLInputElement>(null);
  const editAfterFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch gallery items
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json() as GalleryItem[];
          setGalleryItems(data);
        } else {
          console.error('Failed to fetch gallery items');
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleAddNew = () => {
    if (galleryItems.length >= MAX_GALLERY_ITEMS) {
      alert(`Maximum limit of ${MAX_GALLERY_ITEMS} cases reached. Please delete an existing case before adding a new one.`);
      return;
    }
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewItem({
      title: '',
      description: '',
      beforeImagePath: '/images/profile-pic.png',
      afterImagePath: '/images/profile-pic.png',
      date: new Date().toISOString().split('T')[0]
    });
    setUploadError(null);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setUploadError(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setUploadError(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGalleryItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const handleSaveNew = async () => {
    if (!newItem.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!newItem.beforeImagePath || !newItem.afterImagePath) {
      alert('Both before and after images are required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedItem = await response.json() as GalleryItem;
        setGalleryItems(prev => [...prev, savedItem]);
        setIsAddingNew(false);
        setNewItem({
          title: '',
          description: '',
          beforeImagePath: '/images/profile-pic.png',
          afterImagePath: '/images/profile-pic.png',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        console.error('Failed to save new gallery item');
      }
    } catch (error) {
      console.error('Error saving new gallery item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    if (!editingItem.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!editingItem.beforeImagePath || !editingItem.afterImagePath) {
      alert('Both before and after images are required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        const updatedItem = await response.json() as GalleryItem;
        setGalleryItems(prev => 
          prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
        setEditingItem(null);
      } else {
        console.error('Failed to update gallery item');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [name]: value
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: value
      });
    }
  };

  const handleUploadImage = async (type: 'before' | 'after', isEdit = false) => {
    // Trigger file input click
    if (type === 'before') {
      if (isEdit) {
        editBeforeFileInputRef.current?.click();
      } else {
        beforeFileInputRef.current?.click();
      }
    } else {
      if (isEdit) {
        editAfterFileInputRef.current?.click();
      } else {
        afterFileInputRef.current?.click();
      }
    }
  };

  const uploadFile = async (file: File, type: 'before' | 'after', isEdit = false) => {
    setUploadError(null);
    
    // Set the uploading state for the corresponding image type
    setIsUploading(prev => ({...prev, [type]: true}));
    
    try {
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the upload API
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        console.error(`Error response from upload API:`, errorData);
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json() as { 
        imageUrl?: string;
        success?: boolean;
      };
      
      if (!data.imageUrl) {
        throw new Error('No image URL returned from server');
      }
      
      console.log(`Upload successful, received URL: ${data.imageUrl}`);
      
      // Update the state with the new image URL
      if (isEdit && editingItem) {
        setEditingItem({
          ...editingItem,
          [`${type}ImagePath`]: data.imageUrl
        });
      } else {
        setNewItem({
          ...newItem,
          [`${type}ImagePath`]: data.imageUrl
        });
      }
    } catch (error: any) {
      console.error(`Error uploading ${type} image:`, error);
      setUploadError(error.message || `Failed to upload ${type} image`);
      
      // Show more detailed error to help debugging
      if (error instanceof Error) {
        console.error('Error details:', error.stack);
      }
    } finally {
      setIsUploading(prev => ({...prev, [type]: false}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after', isEdit = false) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (max 2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`Image size exceeds maximum allowed (2MB). Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      // Upload the file
      uploadFile(file, type, isEdit);
    }
  };

  return (
    <AdminLayout activePage="gallery">      
      <div className="p-6">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Case Gallery Items</h1>
          <button
            onClick={handleAddNew}
            disabled={isAddingNew || galleryItems.length >= MAX_GALLERY_ITEMS}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-2" /> Add New Case
          </button>
        </div>

        {galleryItems.length >= MAX_GALLERY_ITEMS && !isAddingNew && !editingItem && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-amber-800 dark:text-amber-200">
              Maximum limit of {MAX_GALLERY_ITEMS} cases reached. Please delete an existing case before adding a new one.
            </p>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-red-800 dark:text-red-200">{uploadError}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Loading gallery items...</div>
        ) : (
          <>
            {/* Add New Form */}
            {isAddingNew && (
              <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Camera size={20} className="mr-2" /> Add New Case
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newItem.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      rows={3}
                    />
                  </div>
                  
                  {/* Before Image */}
                  <div>
                    <label htmlFor="beforeImagePath" className="block text-sm font-medium mb-1">Before Image *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="beforeImagePath"
                        name="beforeImagePath"
                        value={newItem.beforeImagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button 
                        className="bg-secondary px-4 py-2 rounded-r-md flex items-center"
                        onClick={() => handleUploadImage('before')}
                        disabled={isUploading.before}
                      >
                        {isUploading.before ? 'Uploading...' : (
                          <><Upload size={16} className="mr-1" /> Upload</>
                        )}
                      </button>
                      <input 
                        type="file" 
                        ref={beforeFileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'before')}
                      />
                    </div>
                    {newItem.beforeImagePath && (
                      <div className="mt-2">
                        <img 
                          src={newItem.beforeImagePath} 
                          alt="Before Preview" 
                          className="h-20 w-auto object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Upload a "before" image from your device.</p>
                  </div>
                  
                  {/* After Image */}
                  <div>
                    <label htmlFor="afterImagePath" className="block text-sm font-medium mb-1">After Image *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="afterImagePath"
                        name="afterImagePath"
                        value={newItem.afterImagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button 
                        className="bg-secondary px-4 py-2 rounded-r-md flex items-center"
                        onClick={() => handleUploadImage('after')}
                        disabled={isUploading.after}
                      >
                        {isUploading.after ? 'Uploading...' : (
                          <><Upload size={16} className="mr-1" /> Upload</>
                        )}
                      </button>
                      <input 
                        type="file" 
                        ref={afterFileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'after')}
                      />
                    </div>
                    {newItem.afterImagePath && (
                      <div className="mt-2">
                        <img 
                          src={newItem.afterImagePath} 
                          alt="After Preview" 
                          className="h-20 w-auto object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Upload an "after" image from your device.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newItem.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSaveNew}
                      disabled={isSaving || isUploading.before || isUploading.after}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="bg-muted text-muted-foreground px-4 py-2 rounded-md flex items-center hover:bg-muted/90 transition-colors"
                    >
                      <X size={16} className="mr-2" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Edit Form */}
            {editingItem && (
              <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Edit size={20} className="mr-2" /> Edit Gallery Item
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={editingItem.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editingItem.description || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      rows={3}
                    />
                  </div>
                  
                  {/* Before Image */}
                  <div>
                    <label htmlFor="edit-beforeImagePath" className="block text-sm font-medium mb-1">Before Image *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="edit-beforeImagePath"
                        name="beforeImagePath"
                        value={editingItem.beforeImagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button 
                        className="bg-secondary px-4 py-2 rounded-r-md flex items-center"
                        onClick={() => handleUploadImage('before', true)}
                        disabled={isUploading.before}
                      >
                        {isUploading.before ? 'Uploading...' : (
                          <><Upload size={16} className="mr-1" /> Upload</>
                        )}
                      </button>
                      <input 
                        type="file" 
                        ref={editBeforeFileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'before', true)}
                      />
                    </div>
                    {editingItem.beforeImagePath && (
                      <div className="mt-2">
                        <img 
                          src={editingItem.beforeImagePath} 
                          alt="Before Preview" 
                          className="h-20 w-auto object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* After Image */}
                  <div>
                    <label htmlFor="edit-afterImagePath" className="block text-sm font-medium mb-1">After Image *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="edit-afterImagePath"
                        name="afterImagePath"
                        value={editingItem.afterImagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button 
                        className="bg-secondary px-4 py-2 rounded-r-md flex items-center"
                        onClick={() => handleUploadImage('after', true)}
                        disabled={isUploading.after}
                      >
                        {isUploading.after ? 'Uploading...' : (
                          <><Upload size={16} className="mr-1" /> Upload</>
                        )}
                      </button>
                      <input 
                        type="file" 
                        ref={editAfterFileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'after', true)}
                      />
                    </div>
                    {editingItem.afterImagePath && (
                      <div className="mt-2">
                        <img 
                          src={editingItem.afterImagePath} 
                          alt="After Preview" 
                          className="h-20 w-auto object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      id="edit-date"
                      name="date"
                      value={editingItem.date || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving || isUploading.before || isUploading.after}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-muted text-muted-foreground px-4 py-2 rounded-md flex items-center hover:bg-muted/90 transition-colors"
                    >
                      <X size={16} className="mr-2" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gallery Items List */}
            <div className="bg-white dark:bg-gray-800 border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold">Before Image</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold">After Image</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {galleryItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                          No gallery items found. Add some to get started.
                        </td>
                      </tr>
                    ) : (
                      galleryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                          <td className="px-6 py-4">
                            {item.description ? 
                              (item.description.length > 30 ? 
                                `${item.description.substring(0, 30)}...` : 
                                item.description) : 
                              '-'}
                          </td>
                          <td className="px-6 py-4">
                            {item.beforeImagePath ? (
                              <img
                                src={item.beforeImagePath}
                                alt={`Before: ${item.title}`}
                                className="h-12 w-12 object-cover rounded-md"
                              />
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            {item.afterImagePath ? (
                              <img
                                src={item.afterImagePath}
                                alt={`After: ${item.title}`}
                                className="h-12 w-12 object-cover rounded-md"
                              />
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGalleryPage; 