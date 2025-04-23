'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Trophy, Calendar, MapPin } from 'lucide-react';
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

const AchievementsPage = () => {
  const [achievements, _, isLoading] = useLocalStorage<Achievement[]>(
    STORAGE_KEYS.ACHIEVEMENTS,
    defaultAchievements
  );

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">Competitions & Achievements</h1>

          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">
              Loading achievements...
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">No achievements have been added yet.</div>
          ) : (
            <div className="space-y-8">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <Trophy size={36} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">{achievement.title}</h2>
                    </div>

                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{achievement.competition}</h3>

                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin size={16} className="mr-1" />
                          <span>{achievement.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar size={16} className="mr-1" />
                          <span>{achievement.year}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300">{achievement.description || 'No description provided.'}</p>
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

export default AchievementsPage;