'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BarChart, CheckCircle } from 'lucide-react';

const SkillsPage = () => {
  const programmingSkills = [
    { name: 'Python', level: 80 },
    { name: 'C/C++', level: 70 }
  ];

  const roboticsSkills = [
    { name: 'ROS', level: 90 },
    { name: 'Arduino', level: 100 },
    { name: 'Raspberry Pi', level: 80 },
    { name: 'Robo Analyzer', level: 70 }
  ];

  const networkingSkills = [
    { name: 'Cisco Networking (CCNA)', level: 80 },
    { name: 'Packet tracer', level: 80 }
  ];

  const otherSkills = [
    'Troubleshooting & Diagnostics',
    'Cross-functional Collaboration',
    'Problem Solving & Critical Thinking'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Technical Skills</h1>
          
          {/* Programming Skills */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Programming Languages</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <div className="space-y-6">
                {programmingSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-medium text-gray-900">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Robotics Skills */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Robotics Platforms</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <div className="space-y-6">
                {roboticsSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-medium text-gray-900">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Networking Skills */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Networking</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <div className="space-y-6">
                {networkingSkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-medium text-gray-900">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Other Skills */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Other Skills</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherSkills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle size={20} className="text-blue-600 mr-3" />
                    <span className="text-lg text-gray-900">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillsPage;
