'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Trophy, Calendar, MapPin, Plus, Save, Trash2, Edit } from 'lucide-react';

interface Achievement {
  id: number | string;
  title: string;
  competition: string;
  location: string;
  year: string;
  description: string;
}

const AchievementsEditor = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAchievements = useCallback(async () => {
    setIsLoadingData(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/achievements');
      if (!response.ok) {
        throw new Error(`Failed to fetch achievements: ${response.statusText}`);
      }
      const data: Achievement[] = await response.json();
      setAchievements(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load achievements. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement({ ...achievement });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleNew = () => {
    setEditingAchievement({
      id: Date.now(),
      title: '',
      competition: '',
      location: '',
      year: '',
      description: ''
    });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      const updatedAchievements = achievements.filter(achievement => achievement.id !== id);
      await saveAchievements(updatedAchievements, 'Achievement deleted successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingAchievement((prev: Achievement | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const saveAchievements = async (dataToSave: Achievement[], successMessage: string) => {
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} ${errorText}`);
      }

      setAchievements(dataToSave);
      setIsEditing(false);
      setSaveMessage(successMessage);
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (err) {
      console.error(err);
      setErrorMessage(`Error saving achievements: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;

    let updatedAchievements;
    if (achievements.some(achievement => achievement.id === editingAchievement.id)) {
      updatedAchievements = achievements.map(achievement =>
        achievement.id === editingAchievement.id ? editingAchievement : achievement
      );
    } else {
      updatedAchievements = [...achievements, editingAchievement];
    }
    await saveAchievements(updatedAchievements, 'Achievement saved successfully!');
  };

  return (
    <AdminLayout activePage="achievements">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Achievements</h1>
          <p className="text-muted-foreground">Add, edit, or remove your competitions and achievements</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={18} className="mr-2" /> Add Achievement
        </button>
      </div>

      {isLoadingData && (
        <div className="text-center text-muted-foreground py-6">Loading data...</div>
      )}

      {saveMessage && (
        <div className={`p-4 mb-4 rounded-md ${
          saveMessage.includes('deleted') 
            ? 'bg-blue-50 text-blue-700'
            : 'bg-accent text-accent-foreground'
        }`}>
          {saveMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 mb-4 rounded-md bg-destructive text-destructive-foreground">
          {errorMessage}
        </div>
      )}

      {!isLoadingData && (
        isEditing ? (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {editingAchievement?.id && achievements.some(achievement => achievement.id === editingAchievement.id)
                ? 'Edit Achievement'
                : 'Add New Achievement'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editingAchievement?.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-primary bg-background text-foreground"
                    placeholder="e.g., 1st Place, Finalist, Participant"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="competition" className="block text-sm font-medium text-foreground mb-1">
                    Competition/Event
                  </label>
                  <input
                    type="text"
                    id="competition"
                    name="competition"
                    value={editingAchievement?.competition || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-primary bg-background text-foreground"
                    placeholder="Competition or event name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
                    Location/Category
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editingAchievement?.location || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-primary bg-background text-foreground"
                    placeholder="Location or category"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-foreground mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={editingAchievement?.year || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-primary bg-background text-foreground"
                    placeholder="e.g., 2024"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={editingAchievement?.description || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md focus:ring-ring focus:border-primary bg-background text-foreground"
                  placeholder="Describe your achievement"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-foreground bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`flex items-center px-6 py-2 rounded-md text-primary-foreground ${
                    isSaving ? 'bg-primary/70' : 'bg-primary hover:bg-primary/90'
                  } transition-colors`}
                >
                  {isSaving ? 'Saving...' : 'Save Achievement'}
                  {!isSaving && <Save size={18} className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-card dark:bg-card rounded-lg shadow-sm border border-border p-4 flex justify-between items-center">
                <div className="md:w-1/4 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent dark:bg-accent flex items-center justify-center mb-4">
                    <Trophy size={36} className="text-primary dark:text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-center text-primary dark:text-primary-foreground">{achievement.title}</h2>
                </div>

                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{achievement.competition}</h3>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-1" />
                      <span>{achievement.location}</span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      <span>{achievement.year}</span>
                    </div>
                  </div>

                  <p className="text-card-foreground mb-4">{achievement.description}</p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="text-destructive hover:text-destructive/80"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No achievements added yet.</p>
            )}
          </div>
        )
      )}
    </AdminLayout>
  );
};

export default AchievementsEditor;