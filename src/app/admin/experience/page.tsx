'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Briefcase, Calendar, Plus, Save, Trash2, Edit } from 'lucide-react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface Experience {
  id: number;
  organization: string;
  position: string;
  period: string;
  responsibilities: string[];
}

const ExperienceEditor = () => {
  const defaultExperiences: Experience[] = [
    {
      id: 1,
      organization: 'Syrian Private University',
      position: 'Full-Time Lecturer and Project Mentor',
      period: 'September 2024 - Present',
      responsibilities: [
        'Develop and instruct lab courses including ROS, MATLAB, Proteus, Processing, 8086 Emulator, mikroC, and Arduino C',
        'Mentor junior projects, guiding students in project design, implementation, and technical presentation'
      ]
    }
  ];

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
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedExperiences = getFromLocalStorage<Experience[]>(STORAGE_KEYS.EXPERIENCE, defaultExperiences);
    setExperiences(savedExperiences);
  }, []);

  const handleEdit = (experience: Experience) => {
    setEditingExperience({ ...experience });
    setIsEditing(true);
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
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      setExperiences(updatedExperiences);
      saveToLocalStorage(STORAGE_KEYS.EXPERIENCE, updatedExperiences);
      setSaveMessage('Experience deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      let updatedExperiences;
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (experiences.some(exp => exp.id === editingExperience.id)) {
        updatedExperiences = experiences.map(exp => exp.id === editingExperience.id ? editingExperience : exp);
      } else {
        updatedExperiences = [...experiences, editingExperience];
      }

      setExperiences(updatedExperiences);
      saveToLocalStorage(STORAGE_KEYS.EXPERIENCE, updatedExperiences);

      setIsEditing(false);
      setSaveMessage('Experience saved successfully!');
    } catch (err) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

      {isEditing ? (
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
          {experiences.map((experience) => (
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
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Briefcase size={18} className="mr-2 text-blue-600" /> Responsibilities
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {experience.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ExperienceEditor;