'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Briefcase, Calendar, Plus, Save, Trash2, Edit } from 'lucide-react';

const ExperienceEditor = () => {
  // In a real implementation, this data would come from an API
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      organization: 'Syrian Private University',
      position: 'Full-Time Lecturer and Project Mentor',
      period: 'September 2024 - Present',
      responsibilities: [
        'Develop and instruct lab courses including ROS, MATLAB, Proteus, Processing, 8086 Emulator, mikroC, and Arduino C',
        'Mentor junior projects, guiding students in project design, implementation, and technical presentation'
      ]
    },
    {
      id: 2,
      organization: 'RoboTronics (Robotics & PCB Design)',
      position: 'Co-founder & Chief Technology Officer (CTO)',
      period: '2024 - Present',
      responsibilities: [
        'Spearheaded the launch of Syria\'s first solar panel cleaning robot, enhancing renewable energy maintenance solutions',
        'Managed the design and production of PCBs and 3D printed parts, optimizing manufacturing processes for efficiency and cost-effectiveness'
      ]
    },
    {
      id: 3,
      organization: 'SEE (Syrian Engineers Expo)',
      position: 'Co-founder & IT Coordinator',
      period: '2024 - Present',
      responsibilities: [
        'Collaborated with UI/UX and development teams to deliver optimal functionality and user-centric design',
        'Coordinated with front-end and back-end developers to enhance platform stability, security, and user experience'
      ]
    }
  ]);

  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleEdit = (experience: any) => {
    setEditingExperience({...experience});
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingExperience({
      id: Date.now(), // Temporary ID
      organization: '',
      position: '',
      period: '',
      responsibilities: ['']
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      // In a real implementation, this would make an API call to delete the data
      setExperiences(experiences.filter(exp => exp.id !== id));
      setSaveMessage('Experience deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingExperience((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const updatedResponsibilities = [...editingExperience.responsibilities];
    updatedResponsibilities[index] = value;
    setEditingExperience((prev: any) => ({
      ...prev,
      responsibilities: updatedResponsibilities
    }));
  };

  const addResponsibility = () => {
    setEditingExperience((prev: any) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const removeResponsibility = (index: number) => {
    const updatedResponsibilities = [...editingExperience.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setEditingExperience((prev: any) => ({
      ...prev,
      responsibilities: updatedResponsibilities
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // In a real implementation, this would make an API call to save the data
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (experiences.some(exp => exp.id === editingExperience.id)) {
        // Update existing experience
        setExperiences(experiences.map(exp => 
          exp.id === editingExperience.id ? editingExperience : exp
        ));
      } else {
        // Add new experience
        setExperiences([...experiences, editingExperience]);
      }
      
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingExperience.id && experiences.some(exp => exp.id === editingExperience.id) 
              ? 'Edit Experience' 
              : 'Add New Experience'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization/Company
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={editingExperience.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 !important"
                  placeholder="Organization name"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position/Title
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={editingExperience.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 !important"
                  placeholder="Your position"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <input
                type="text"
                id="period"
                name="period"
                value={editingExperience.period}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 !important"
                placeholder="e.g., January 2020 - Present"
                required
                style={{color: '#1f2937'}}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsibilities
              </label>
              {editingExperience.responsibilities.map((responsibility: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800 !important"
                    placeholder="Describe your responsibility"
                    required
                    style={{color: '#1f2937'}}
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
                className="text-blue-600 hover:text-blue-800 flex items-center mt-2"
              >
                <Plus size={18} className="mr-1" /> Add Responsibility
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-800"
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
                {isSaving ? 'Saving...' : 'Save Experience'}
                {!isSaving && <Save size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
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
                    <Briefcase size={18} className="mr-2 text-blue-600" />
                    Responsibilities
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {experience.responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
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
