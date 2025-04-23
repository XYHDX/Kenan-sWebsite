'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BarChart, CheckCircle } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localStorage';

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

const SkillsPage = () => {
  const [skillsData, _, isLoading] = useLocalStorage<SkillsData>(
    STORAGE_KEYS.SKILLS, 
    defaultSkills
  );

  const { programming, robotics, networking, other } = skillsData || defaultSkills;
  const hasSkills = programming?.length > 0 || robotics?.length > 0 || networking?.length > 0 || other?.length > 0;

  const renderSkillSection = (title: string, skills: Skill[], isOther: boolean = false) => {
    if (!skills || skills.length === 0) return null;
    
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {isOther ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center">
                  <CheckCircle size={20} className="text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                  <span className="text-lg text-gray-900 dark:text-white">{skill.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-400">Technical Skills</h1>
          
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">
              Loading skills...
            </div>
          ) : !hasSkills ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-xl py-10">No skills have been added yet.</div>
          ) : (
            <>
              {renderSkillSection('Programming Languages', programming)}
              {renderSkillSection('Robotics Platforms', robotics)}
              {renderSkillSection('Networking', networking)}
              {renderSkillSection('Other Skills', other, true)}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillsPage;
