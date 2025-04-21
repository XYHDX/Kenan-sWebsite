'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Trophy, Calendar, MapPin, Plus, Save, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

interface Achievement {
  id: number;
  title: string;
  competition: string;
  location: string;
  year: string;
  description: string;
}

const AchievementsEditor = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const response = await fetch('/api/achievements');
      const data: Achievement[] = await response.json();
      setAchievements(data);
    };
    fetchAchievements();
  }, []);

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingAchievement({
      id: Date.now(), // Temporary ID
      title: '',
      competition: '',
      location: '',
      year: '',
      description: ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      // In a real implementation, this would make an API call to delete the data
      setAchievements(achievements.filter(achievement => achievement.id !== id));
      setSaveMessage('Achievement deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingAchievement((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (editingAchievement) {
        if (achievements.some(achievement => achievement.id === editingAchievement.id)) {
          setAchievements(achievements.map(achievement => 
            achievement.id === editingAchievement.id ? editingAchievement : achievement
          ));
        } else {
          setAchievements([...achievements, editingAchievement]);
        }
      }
      setIsEditing(false);
      setSaveMessage('Achievement saved successfully!');
    } catch (err) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activePage="achievements">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Achievements</h1>
          <p className="text-gray-600">Add, edit, or remove your competitions and achievements</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Achievement
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAchievement?.id && achievements.some(achievement => achievement.id === editingAchievement.id) 
              ? 'Edit Achievement' 
              : 'Add New Achievement'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Position
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingAchievement?.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="e.g., 1st Place, Finalist, Participant"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>

              <div>
                <label htmlFor="competition" className="block text-sm font-medium text-gray-700 mb-1">
                  Competition/Event
                </label>
                <input
                  type="text"
                  id="competition"
                  name="competition"
                  value={editingAchievement?.competition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Competition or event name"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location/Category
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editingAchievement?.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Location or category"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={editingAchievement?.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="e.g., 2024"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={editingAchievement?.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Describe your achievement"
                required
                style={{color: '#1f2937'}}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-800"
                style={{color: '#1f2937'}}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-6 py-2 rounded-md text-white ${
                  isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isSaving ? 'Saving...' : 'Save Achievement'}
                {!isSaving && <Save size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Image
                      src="/images/profile-pic.png"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-center text-gray-900">{achievement.title}</h2>
                </div>
                
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.competition}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{achievement.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>{achievement.year}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{achievement.description}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AchievementsEditor;
