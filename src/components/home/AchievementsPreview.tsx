'use client';

import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

interface Achievement {
  id: number | string;
  title: string;
  competition: string;
  location: string;
  year: string;
  description?: string;
}

const defaultAchievements: Achievement[] = [];

const AchievementsPreview = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [achievements, _, isLoading] = useLocalStorage<Achievement[]>(
    STORAGE_KEYS.ACHIEVEMENTS, 
    defaultAchievements
  );

  const previewAchievements = achievements.slice(0, 3);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Achievements</h2>
          <Link 
            href="/achievements" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full mr-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-3 w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : previewAchievements.length === 0 ? (
           <div className="text-center text-gray-500 dark:text-gray-400">No achievements available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <Trophy size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{achievement.title}</h3>
                </div>
                <h4 className="text-primary font-medium mb-1">{achievement.competition}</h4>
                <p className="text-gray-700 dark:text-gray-300">{achievement.location}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{achievement.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsPreview;
