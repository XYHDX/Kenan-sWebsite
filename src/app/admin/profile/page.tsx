'use client';

import { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { saveToLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImage?: string;
}

const ProfileEditor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // In a real implementation, this data would come from an API
  const [formData, setFormData] = useState<ProfileData>({
    name: 'Yahya Demeriah',
    title: 'IT Engineer & Robotics Specialist',
    email: 'yahyademeriah@gmail.com',
    phone: '+963 956 633 888',
    location: 'Masaken Barzeh, Damascus, Syria',
    summary: 'Results-driven IT Engineer and Robotics Specialist with over 3 years of experience leading teams, designing robotic systems, and optimizing IT infrastructures. Demonstrated success in mentoring junior engineers and students, and recognized for implementing robust IT solutions. Skilled in emerging technologies and cross-functional collaboration to drive innovation.',
    profileImage: '/images/profile-pic.png'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image locally first
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setSaveMessage('');
    try {
      console.log('Starting image upload for file:', file.name);
      
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Try file upload first
      let imageUrl = '';
      let useDataUrl = false;
      
      try {
        // Upload the image to the server
        console.log('Sending request to /api/admin/upload');
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        console.log('Upload response status:', response.status);
        
        // Get the response data
        const responseData = await response.json() as { 
          imageUrl?: string;
          error?: string;
          success?: boolean;
        };
        console.log('Upload response data:', responseData);
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to upload image');
        }

        if (!responseData.imageUrl) {
          throw new Error('No image URL returned from server');
        }
        
        imageUrl = responseData.imageUrl;
      } catch (uploadError) {
        console.warn('Server file upload failed, falling back to data URL:', uploadError);
        
        // Fallback to data URL if file upload fails
        return new Promise<void>((resolve) => {
          const fallbackReader = new FileReader();
          fallbackReader.onloadend = async () => {
            imageUrl = fallbackReader.result as string;
            useDataUrl = true;
            
            // Update formData with the data URL
            const updatedFormData = {
              ...formData,
              profileImage: imageUrl
            };
            setFormData(updatedFormData);
            
            // Automatically save to backend when using data URL
            try {
              await saveProfileData(updatedFormData);
              setSaveMessage('Image stored as data URL and saved to profile.');
            } catch (saveError) {
              console.error('Error saving profile with data URL:', saveError);
              setSaveMessage('Image stored as data URL (client-side only). Click Save Changes to persist.');
            }
            
            setIsUploading(false);
            resolve();
          };
          fallbackReader.readAsDataURL(file);
        });
      }
      
      if (!useDataUrl) {
        // Update formData with the new image URL
        const updatedFormData = {
          ...formData,
          profileImage: imageUrl
        };
        setFormData(updatedFormData);
        
        // Automatically save to backend when upload succeeds
        try {
          await saveProfileData(updatedFormData);
          setSaveMessage('Image uploaded and saved successfully!');
        } catch (saveError) {
          console.error('Error saving profile after upload:', saveError);
          setSaveMessage('Image uploaded but not saved. Click Save Changes to persist.');
        }
      }
    } catch (error) {
      console.error('Error handling image:', error);
      setSaveMessage('Failed to upload image. Please try again. ' + (error instanceof Error ? error.message : ''));
      
      // Reset the preview if there was an error
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to save profile data to the backend
  const saveProfileData = async (profileData: ProfileData): Promise<void> => {
    // Save to localStorage for fallback
    saveToLocalStorage(STORAGE_KEYS.PROFILE, profileData);

    // Save to Redis via API endpoint
    const response = await fetch('/api/admin/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to save profile');
    }
    
    return;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await saveProfileData(formData);
      setSaveMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activePage="profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600">Update your personal information and professional summary</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') || saveMessage.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Your professional title"
                />
              </div>

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
                <label htmlFor="profile-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                        <Loader2 size={40} className="animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <Image
                        src={imagePreview || formData.profileImage || "/images/profile-pic.png"}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Change Image'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows={8}
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Write a brief professional summary"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className={`flex items-center px-6 py-2 rounded-md text-white ${
                isSaving || isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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

export default ProfileEditor;
