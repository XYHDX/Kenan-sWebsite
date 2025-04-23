'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Briefcase, Calendar } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  description?: string;
  responsibilities?: string[];
}

const defaultExperiences: Experience[] = [];

const ExperiencePage = () => {
  const [experiences, _, isLoading] = useLocalStorage<Experience[]>(
    STORAGE_KEYS.EXPERIENCE, 
    defaultExperiences
  );

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">Professional Experience</h1>
          
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-pulse">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">No professional experience has been added yet.</div>
          ) : (
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.organization}</h2>
                      <h3 className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.position}</h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar size={16} className="mr-2" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                        <Briefcase size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                        Responsibilities
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                        {exp.responsibilities && exp.responsibilities.length > 0 ? (
                          exp.responsibilities.map((responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          ))
                        ) : (
                          <li className="text-gray-500 dark:text-gray-400 italic">No specific responsibilities listed.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;
