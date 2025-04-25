'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Calendar, Plus, Save, Trash2, Edit } from 'lucide-react';

interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  responsibilities: string[];
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience>({
    id: Date.now(),
    organization: '',
    position: '',
    period: '',
    responsibilities: ['']
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch experiences from our Redis API
  const fetchExperiences = async () => {
    setIsLoadingData(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/experience');
      if (!response.ok) {
        throw new Error(`Failed to fetch experiences: ${response.statusText}`);
      }
      const data: Experience[] = await response.json();
      setExperiences(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load experiences. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleEdit = (experience: Experience) => {
    setEditingExperience({ ...experience });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleNew = () => {
    setEditingExperience({
      id: Date.now(),
      organization: '',
      position: '',
      period: '',
      responsibilities: ['']
    });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      await saveExperiences(updatedExperiences, 'Experience deleted successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const updatedResponsibilities = [...editingExperience.responsibilities];
    updatedResponsibilities[index] = value;
    setEditingExperience(prev => ({ ...prev, responsibilities: updatedResponsibilities }));
  };

  const addResponsibility = () => {
    setEditingExperience(prev => ({ ...prev, responsibilities: [...prev.responsibilities, ''] }));
  };

  const removeResponsibility = (index: number) => {
    const updatedResponsibilities = [...editingExperience.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setEditingExperience(prev => ({ ...prev, responsibilities: updatedResponsibilities }));
  };

  // Save experiences to our Redis API
  const saveExperiences = async (dataToSave: Experience[], successMessage: string) => {
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/experience', {
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

      setExperiences(dataToSave);
      setIsEditing(false);
      setSaveMessage(successMessage);
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (err) {
      console.error(err);
      setErrorMessage(`Error saving experiences: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    let updatedExperiences;
    if (experiences.some(exp => exp.id === editingExperience.id)) {
      updatedExperiences = experiences.map(exp => exp.id === editingExperience.id ? editingExperience : exp);
    } else {
      updatedExperiences = [...experiences, editingExperience];
    }
    await saveExperiences(updatedExperiences, 'Experience saved successfully!');
  };

  return (
    <AdminLayout activePage="experience">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Experience</h1>
          <p className="text-gray-600">Add, edit, or remove your professional experience</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Experience
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 rounded-md bg-red-50 text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoadingData ? (
        <div className="text-center py-10 text-gray-500">Loading experiences...</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                name="organization"
                value={editingExperience.organization}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={editingExperience.position}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Period</label>
              <input
                type="text"
                name="period"
                value={editingExperience.period}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
              <input
                type="text"
                name="location"
                value={editingExperience.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
            {editingExperience.responsibilities.map((resp, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                  required
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
                {editingExperience.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResponsibility(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addResponsibility}
              className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus size={18} className="mr-1" /> Add Responsibility
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-6 py-2 rounded-md text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isSaving ? 'Saving...' : 'Save Experience'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {experiences.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No experiences added yet.</div>
          ) : (
            experiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-900">{experience.organization}</h2>
                    <h3 className="text-blue-600 font-medium mb-2">{experience.position}</h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>{experience.period}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(experience)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="font-medium text-gray-900 mb-2">Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {experience.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                    {experience.location && (
                      <p className="mt-4 text-gray-600">
                        <span className="font-medium">Location:</span> {experience.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default ExperienceEditor;