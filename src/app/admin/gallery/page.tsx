'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Camera, Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  imagePath: string;
  date?: string;
}

const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    description: '',
    imagePath: '/images/profile-pic.png', // Default image
    date: new Date().toISOString().split('T')[0]
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewItem({
      title: '',
      description: '',
      imagePath: '/images/profile-pic.png',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
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
          imagePath: '/images/profile-pic.png',
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

  return (
    <AdminLayout activePage="gallery">      
      <div className="p-6">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold">Gallery Items</h1>
          <button
            onClick={handleAddNew}
            disabled={isAddingNew}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-2" /> Add New Item
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading gallery items...</div>
        ) : (
          <>
            {/* Add New Form */}
            {isAddingNew && (
              <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Camera size={20} className="mr-2" /> Add New Gallery Item
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
                  
                  <div>
                    <label htmlFor="imagePath" className="block text-sm font-medium mb-1">Image Path *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="imagePath"
                        name="imagePath"
                        value={newItem.imagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button className="bg-secondary px-4 py-2 rounded-r-md flex items-center">
                        <Upload size={16} className="mr-1" /> Upload
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Enter the path to the image or upload a new one.</p>
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
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancelAdd}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNew}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'} <Save size={16} className="ml-2" />
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
                  
                  <div>
                    <label htmlFor="edit-imagePath" className="block text-sm font-medium mb-1">Image Path *</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="edit-imagePath"
                        name="imagePath"
                        value={editingItem.imagePath}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700"
                        required
                      />
                      <button className="bg-secondary px-4 py-2 rounded-r-md flex items-center">
                        <Upload size={16} className="mr-1" /> Upload
                      </button>
                    </div>
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
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'} <Save size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Items List */}
            {galleryItems.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 border border-border rounded-lg">
                <Camera size={40} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No gallery items found. Add your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map(item => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 border border-border rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      {item.imagePath ? (
                        <img 
                          src={item.imagePath} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Camera size={40} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                      )}
                      {item.date && (
                        <p className="text-xs text-muted-foreground mb-4">
                          Date: {new Date(item.date).toLocaleDateString()}
                        </p>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                          aria-label="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGalleryPage; 