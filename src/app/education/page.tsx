'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { getFromLocalStorage, setupStorageListener, STORAGE_KEYS } from '@/lib/localStorage';

// Define types
interface Certification {
  id: string | number;
  title: string;
  organization: string;
  year: string | number;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  project: string;
  details: string[];
}

// Moved outside the component
const defaultEducation: Education = {
  degree: 'Bachelor of Engineering',
  institution: 'Syrian Private University',
  period: '2016 - 2024',
  project: 'Waste Sorting System Using Object Detection',
  details: [
    'Developed an automated system for waste classification and sorting, utilizing object detection',
    'Integrated a mechanical sorting mechanism, achieving a 40% efficiency improvement in waste segregation'
  ]
};

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
  },
  {
    id: 5,
    title: 'Engineering and Maintenance of Computer Networks',
    organization: 'Asia Training Center',
    year: '2018'
  }
];

const EducationPage = () => {
  // State for data
  const [education, setEducation] = useState<Education>(defaultEducation);
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on initial render and listen for changes
  useEffect(() => {
    // Load education data
    const savedEducation = getFromLocalStorage<Education>(STORAGE_KEYS.EDUCATION, defaultEducation);
    setEducation(savedEducation);

    // Load certifications data
    const savedCertifications = getFromLocalStorage<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, defaultCertifications);
    setCertifications(savedCertifications);
    
    setIsLoading(false);

    // Set up listeners for changes in localStorage
    const educationCleanup = setupStorageListener(STORAGE_KEYS.EDUCATION, () => {
      const updatedEducation = getFromLocalStorage<Education>(STORAGE_KEYS.EDUCATION, defaultEducation);
      setEducation(updatedEducation);
    });

    const certificationsCleanup = setupStorageListener(STORAGE_KEYS.CERTIFICATIONS, () => {
      const updatedCertifications = getFromLocalStorage<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, defaultCertifications);
      setCertifications(updatedCertifications);
    });

    // Clean up listeners
    return () => {
      educationCleanup();
      certificationsCleanup();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <main className="flex-grow py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Education & Certifications</h1>
          
          {/* Education Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center dark:text-white">
              <GraduationCap size={24} className="mr-2 text-primary dark:text-primary" />
              Education
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{education.degree}</h3>
                  <h4 className="text-primary dark:text-primary font-medium mb-2">{education.institution}</h4>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{education.period}</span>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md border border-gray-100 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-4">Project: {education.project}</h5>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      {education.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Certifications Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center dark:text-white">
              <Award size={24} className="mr-2 text-primary dark:text-primary" />
              Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{cert.title}</h3>
                  <p className="text-primary dark:text-primary mb-1">{cert.organization}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducationPage;
