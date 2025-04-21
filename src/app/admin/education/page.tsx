'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { GraduationCap, Calendar, Award, Plus, Save, Trash2, Edit } from 'lucide-react';

const EducationEditor = () => {
  // In a real implementation, this data would come from an API
  const [education, setEducation] = useState({
    degree: 'Bachelor of Engineering',
    institution: 'Syrian Private University',
    period: '2016 - 2024',
    project: 'Waste Sorting System Using Object Detection',
    details: [
      'Developed an automated system for waste classification and sorting, utilizing object detection',
      'Integrated a mechanical sorting mechanism, achieving a 40% efficiency improvement in waste segregation'
    ]
  });

  const [certifications, setCertifications] = useState([
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
  ]);

  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [isEditingCertification, setIsEditingCertification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Education form handlers
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailChange = (index: number, value: string) => {
    const updatedDetails = [...education.details];
    updatedDetails[index] = value;
    setEducation(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  const addDetail = () => {
    setEducation(prev => ({
      ...prev,
      details: [...prev.details, '']
    }));
  };

  const removeDetail = (index: number) => {
    const updatedDetails = [...education.details];
    updatedDetails.splice(index, 1);
    setEducation(prev => ({
      ...prev,
      details: updatedDetails
    }));
  };

  const saveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // In a real implementation, this would make an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditingEducation(false);
      setSaveMessage('Education updated successfully!');
    } catch (err) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Certification handlers
  const handleEditCertification = (certification: any) => {
    setEditingCertification({...certification});
    setIsEditingCertification(true);
  };

  const handleNewCertification = () => {
    setEditingCertification({
      id: Date.now(), // Temporary ID
      title: '',
      organization: '',
      year: ''
    });
    setIsEditingCertification(true);
  };

  const handleDeleteCertification = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      // In a real implementation, this would make an API call to delete the data
      setCertifications(certifications.filter(cert => cert.id !== id));
      setSaveMessage('Certification deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingCertification((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // In a real implementation, this would make an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (certifications.some(cert => cert.id === editingCertification.id)) {
        // Update existing certification
        setCertifications(certifications.map(cert => 
          cert.id === editingCertification.id ? editingCertification : cert
        ));
      } else {
        // Add new certification
        setCertifications([...certifications, editingCertification]);
      }
      
      setIsEditingCertification(false);
      setSaveMessage('Certification saved successfully!');
    } catch (err) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activePage="education">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Education & Certifications</h1>
        <p className="text-gray-600">Manage your educational background and professional certifications</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center text-gray-800">
            <GraduationCap size={20} className="mr-2 text-blue-600" />
            Education
          </h2>
          {!isEditingEducation && (
            <button
              onClick={() => setIsEditingEducation(true)}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
            >
              <Edit size={14} className="mr-1" /> Edit
            </button>
          )}
        </div>

        {isEditingEducation ? (
          <form onSubmit={saveEducation}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={education.degree}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Your degree"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={education.institution}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Institution name"
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
                value={education.period}
                onChange={handleEducationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="e.g., 2016 - 2024"
                required
                style={{color: '#1f2937'}}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="project"
                name="project"
                value={education.project}
                onChange={handleEducationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Your project title"
                required
                style={{color: '#1f2937'}}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Details
              </label>
              {education.details.map((detail, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    placeholder="Describe your project detail"
                    required
                    style={{color: '#1f2937'}}
                  />
                  {education.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDetail}
                className="text-blue-600 hover:text-blue-800 flex items-center mt-2"
              >
                <Plus size={18} className="mr-1" /> Add Detail
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditingEducation(false)}
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
                {isSaving ? 'Saving...' : 'Save Education'}
                {!isSaving && <Save size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="text-lg font-semibold text-gray-900">{education.degree}</h3>
              <h4 className="text-blue-600 font-medium mb-2">{education.institution}</h4>
              <div className="flex items-center text-gray-500 mb-4">
                <Calendar size={16} className="mr-2" />
                <span>{education.period}</span>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                <h5 className="font-medium text-gray-900 mb-4">Project: {education.project}</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {education.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center text-gray-800">
            <Award size={20} className="mr-2 text-blue-600" />
            Certifications
          </h2>
          {!isEditingCertification && (
            <button
              onClick={handleNewCertification}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={18} className="mr-2" /> Add Certification
            </button>
          )}
        </div>

        {isEditingCertification ? (
          <form onSubmit={saveCertification} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editingCertification.title}
                  onChange={handleCertificationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Certification title"
                  required
                  style={{color: '#1f2937'}}
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={editingCertification.organization}
                  onChange={handleCertificationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Organization name"
                  style={{color: '#1f2937'}}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={editingCertification.year}
                onChange={handleCertificationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="e.g., 2023"
                required
                style={{color: '#1f2937'}}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditingCertification(false)}
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
                {isSaving ? 'Saving...' : 'Save Certification'}
                {!isSaving && <Save size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div 
                key={cert.id} 
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{cert.title}</h3>
                <p className="text-blue-600 mb-1">{cert.organization}</p>
                <p className="text-gray-500 text-sm mb-4">{cert.year}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCertification(cert)}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Edit size={14} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCertification(cert.id)}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EducationEditor;
