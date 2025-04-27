'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Award, Plus, Save, Trash2, Edit } from 'lucide-react';

// Define types
interface Certification {
  id: number | string;
  title: string;
  organization: string;
  year: string;
  description?: string;
}

const CertificationsEditor = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingCertification, setEditingCertification] = useState<Certification>({
    id: Date.now(),
    title: '',
    organization: '',
    year: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch certifications from our Redis API
  const fetchCertifications = async () => {
    setIsLoadingData(true);
    setErrorMessage('');
    try {
      // Use type=certifications parameter to get certification data
      const response = await fetch('/api/admin/education?type=certifications');
      if (!response.ok) {
        throw new Error(`Failed to fetch certifications: ${response.statusText}`);
      }
      const data: Certification[] = await response.json();
      setCertifications(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load certifications. Please refresh.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleEdit = (cert: Certification) => {
    setEditingCertification({ ...cert });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleNew = () => {
    setEditingCertification({
      id: Date.now(),
      title: '',
      organization: '',
      year: ''
    });
    setIsEditing(true);
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      const updatedCertifications = certifications.filter(cert => cert.id !== id);
      await saveCertifications(updatedCertifications, 'Certification deleted successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingCertification(prev => ({ ...prev, [name]: value }));
  };

  // Save certifications to our Redis API
  const saveCertifications = async (dataToSave: Certification[], successMessage: string) => {
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    try {
      // Use type=certifications parameter to save certification data
      const response = await fetch('/api/admin/education?type=certifications', {
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

      setCertifications(dataToSave);
      setIsEditing(false);
      setSaveMessage(successMessage);
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (err) {
      console.error(err);
      setErrorMessage(`Error saving certification: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertification) return;

    let updatedCertifications;
    if (certifications.some(cert => cert.id === editingCertification.id)) {
      updatedCertifications = certifications.map(cert => cert.id === editingCertification.id ? editingCertification : cert);
    } else {
      updatedCertifications = [...certifications, editingCertification];
    }
    await saveCertifications(updatedCertifications, 'Certification saved successfully!');
  };

  return (
    <AdminLayout activePage="certifications">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Certifications</h1>
          <p className="text-gray-600">Add, edit, or remove your certifications and licenses</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Certification
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
        <div className="text-center py-10 text-gray-500">Loading certifications...</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={editingCertification.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                placeholder="e.g. AWS Certified Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                name="organization"
                value={editingCertification.organization}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                placeholder="e.g. Amazon Web Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                name="year"
                value={editingCertification.year}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                placeholder="e.g. 2023"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              name="description"
              value={editingCertification.description || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
              placeholder="Additional details about this certification..."
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
              {isSaving ? 'Saving...' : 'Save Certification'}
              {!isSaving && <Save size={18} className="ml-2" />}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {certifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No certifications added yet.</div>
          ) : (
            certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-900">{cert.title}</h2>
                    <h3 className="text-blue-600 font-medium mb-2">{cert.organization}</h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Award size={16} className="mr-2" />
                      <span>{cert.year}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cert)}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  {cert.description && (
                    <div className="md:w-2/3">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                        <p className="text-gray-700">{cert.description}</p>
                      </div>
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

export default CertificationsEditor; 