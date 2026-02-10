'use client';

import { useState, useEffect } from 'react';
import { getFromLocalStorage, STORAGE_KEYS } from '@/lib/localStorage';

interface ProfileData {
  dateOfBirth?: string;
  maritalStatus?: string;
  nationality?: string;
  instagram?: string;
  phone?: string;
}

const PersonalDetails = () => {
  const [details, setDetails] = useState<ProfileData>({
    dateOfBirth: '11/5/1993',
    maritalStatus: 'Single',
    nationality: 'Syrian',
    instagram: 'Kenan.saoud',
    phone: '011- 5112870'
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Try to get data from API first
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          if (data && (data.dateOfBirth || data.maritalStatus)) {
            setDetails(prev => ({
              ...prev,
              ...data
            }));
          } else {
            // Fallback to localStorage if API data is incomplete
            const localData = getFromLocalStorage<ProfileData>(STORAGE_KEYS.PROFILE, {} as ProfileData);
            if (localData && (localData.dateOfBirth || localData.maritalStatus)) {
              setDetails(prev => ({
                ...prev,
                ...localData
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching personal details:', error);
        // Fallback to localStorage on error
        const localData = getFromLocalStorage<ProfileData>(STORAGE_KEYS.PROFILE, {} as ProfileData);
        if (localData && (localData.dateOfBirth || localData.maritalStatus)) {
          setDetails(prev => ({
            ...prev,
            ...localData
          }));
        }
      }
    };

    fetchDetails();

    // Listen for localStorage updates
    const handleStorageChange = () => {
      const localData = getFromLocalStorage<ProfileData>(STORAGE_KEYS.PROFILE, {} as ProfileData);
      if (localData && (localData.dateOfBirth || localData.maritalStatus)) {
        setDetails(prev => ({
          ...prev,
          ...localData
        }));
      }
    };

    window.addEventListener('storageupdate', handleStorageChange);
    return () => window.removeEventListener('storageupdate', handleStorageChange);
  }, []);

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Personal Details</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-medium w-36">Date of Birth:</span>
                <span>{details.dateOfBirth}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Marital Status:</span>
                <span>{details.maritalStatus}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Nationality:</span>
                <span>{details.nationality}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Phone:</span>
                <span>{details.phone}</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Instagram:</span>
                <span>{details.instagram}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalDetails; 