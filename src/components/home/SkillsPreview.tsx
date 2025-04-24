'use client';

import { BarChart, CheckCircle } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';
import Link from 'next/link';

interface Skill {
  id: string | number;
  name: string;
  level?: number;
}

interface SkillsData {
  programming: Skill[];
  robotics: Skill[];
  networking: Skill[];
  other: Skill[];
}

const defaultSkills: SkillsData = {
  programming: [],
  robotics: [],
  networking: [],
  other: []
};

const SkillsPreview = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [skillsData, _, isLoading] = useLocalStorage<SkillsData>(
    STORAGE_KEYS.SKILLS, 
    defaultSkills
  );

  const { programming, robotics, networking, other } = skillsData || defaultSkills;

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Skills Overview</h2>
          <Link 
            href="/skills" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <BarChart size={16} className="ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, j) => (
                      <div key={j}>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, k) => (
                  <div key={k} className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(programming && programming.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Programming</h3>
                  <div className="space-y-4">
                    {programming.slice(0, 5).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(robotics && robotics.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Robotics</h3>
                  <div className="space-y-4">
                    {robotics.slice(0, 5).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(networking && networking.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Networking</h3>
                  <div className="space-y-4">
                    {networking.slice(0, 5).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(other && other.length > 0) && (
              <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Other Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {other.slice(0, 6).map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!programming?.length && !robotics?.length && !networking?.length && !other?.length && (
              <div className="text-center text-gray-500 dark:text-gray-400">No skills available yet.</div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsPreview;
