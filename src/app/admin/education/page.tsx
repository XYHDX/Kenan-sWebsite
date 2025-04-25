'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { GraduationCap, Calendar, Award, Plus, Save, Trash2, Edit } from 'lucide-react';
import { saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

// Define types
interface Certification {
  id: string | number;
  title: string;
  organization: string;
  year: string | number;
}

interface Education {
  id: number | string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
  location?: string;
  gpa?: string;
  startDate?: string;
  endDate?: string;
}

// Moved outside the component
const defaultEducation: Education = {
  id: Date.now(),
  institution: 'Syrian Private University',
  degree: 'Bachelor of Engineering',
  field: 'Computer Science',
  period: '2016 - 2024',
  description: 'Developed an automated system for waste classification and sorting, utilizing object detection',
  location: 'Damascus, Syria',
  gpa: '3.8'
};

// Moved outside the component
const defaultCertifications: Certification[] = [
  {
    id: 1,
    title: 'Take the Lead Program',
    organization: 'Cornell University',
    year: '2023'
  },
  {
    id: 2,
    title: 'Certified Lego EV3 Trainer',
    organization: 'Syrian Robotic Academy',
    year: '2023'
  },
  {
    id: 3,
    title: 'Advertising Design Program',
    organization: 'Youth Empowerment Program',
    year: '2021'
  },
  {
    id: 4,
    title: 'Cisco CCNA R&S',
    organization: 'NGO Egypt',
    year: '2018'
  }
];

const EducationEditor = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [editingEducation, setEditingEducation] = useState<Education>({
    id: Date.now(),
    institution: '',
    degree: '',
    field: '',
    period: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch education from our Redis API
  const fetchEducation = async () => {
    setIsLoadingData(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/education');
      if (!response.ok) {
        throw new Error(`Failed to fetch education: ${response.statusText}`);
      }
      const data: Education[] = await response.json();
      setEducation(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load education. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleEdit = (edu: Education) => {
    setEditingEducation({ ...edu });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleNew = () => {
    setEditingEducation({
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      period: ''
    });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      const updatedEducation = education.filter(edu => edu.id !== id);
      await saveEducation(updatedEducation, 'Education deleted successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingEducation(prev => ({ ...prev, [name]: value }));
  };

  // Save education to our Redis API
  const saveEducation = async (dataToSave: Education[], successMessage: string) => {
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/education', {
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

      setEducation(dataToSave);
      setIsEditing(false);
      setSaveMessage(successMessage);
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (err) {
      console.error(err);
      setErrorMessage(`Error saving education: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEducation) return;

    let updatedEducation;
    if (education.some(edu => edu.id === editingEducation.id)) {
      updatedEducation = education.map(edu => edu.id === editingEducation.id ? editingEducation : edu);
    } else {
      updatedEducation = [...education, editingEducation];
    }
    await saveEducation(updatedEducation, 'Education saved successfully!');
  };

  return (
    <AdminLayout activePage="education">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Education</h1>
          <p className="text-gray-600">Add, edit, or remove your educational background</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Education
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
        <div className="text-center py-10 text-gray-500">Loading education...</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                name="institution"
                value={editingEducation.institution}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                name="degree"
                value={editingEducation.degree}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Field of Study</label>
              <input
                type="text"
                name="field"
                value={editingEducation.field}
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
                value={editingEducation.period}
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
                value={editingEducation.location || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GPA (Optional)</label>
              <input
                type="text"
                name="gpa"
                value={editingEducation.gpa || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              value={editingEducation.description || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-6 py-2 rounded-md text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isSaving ? 'Saving...' : 'Save Education'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {education.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No education added yet.</div>
          ) : (
            education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-900">{edu.institution}</h2>
                    <h3 className="text-blue-600 font-medium mb-2">{edu.degree} in {edu.field}</h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>{edu.period}</span>
                    </div>
                    {edu.gpa && (
                      <div className="mb-4 text-gray-700">
                        <span className="font-medium">GPA:</span> {edu.gpa}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  {(edu.description || edu.location) && (
                    <div className="md:w-2/3">
                      {edu.description && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                          <p className="text-gray-700">{edu.description}</p>
                        </div>
                      )}
                      {edu.location && (
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {edu.location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default EducationEditor;
