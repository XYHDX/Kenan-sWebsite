'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

const ExperiencePreview = () => {
  const [experiences, _, isLoading] = useLocalStorage<Experience[]>(
    STORAGE_KEYS.EXPERIENCE, 
    defaultExperiences
  );

  const previewExperiences = experiences.slice(0, 3);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Experience Highlights</h2>
          <Link 
            href="/experience" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : previewExperiences.length === 0 ? (
           <div className="text-center text-gray-500 dark:text-gray-400">No experience highlights available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewExperiences.map((exp) => (
              <div 
                key={exp.id} 
                className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{exp.organization}</h3>
                <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-1">{exp.position}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{exp.period}</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {exp.description || exp.responsibilities?.[0] || 'Details available on the experience page.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperiencePreview;
