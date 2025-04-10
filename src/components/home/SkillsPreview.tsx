'use client';

import { BarChart, CheckCircle } from 'lucide-react';

const SkillsPreview = () => {
  const programmingSkills = [
    { name: 'Python', level: 80 },
    { name: 'C/C++', level: 70 }
  ];

  const roboticsSkills = [
    { name: 'ROS', level: 90 },
    { name: 'Arduino', level: 100 },
    { name: 'Raspberry Pi', level: 80 }
  ];

  const otherSkills = [
    'Troubleshooting & Diagnostics',
    'Cross-functional Collaboration',
    'Problem Solving & Critical Thinking'
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600">Skills Overview</h2>
          <a 
            href="/skills" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            See All <BarChart size={16} className="ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Programming Skills */}
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Programming Languages</h3>
            <div className="space-y-4">
              {programmingSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Robotics Skills */}
          <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Robotics Platforms</h3>
            <div className="space-y-4">
              {roboticsSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Skills */}
        <div className="mt-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherSkills.map((skill) => (
              <div key={skill} className="flex items-center">
                <CheckCircle size={18} className="text-blue-600 mr-2" />
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsPreview;
