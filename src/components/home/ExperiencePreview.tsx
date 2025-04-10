'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ExperiencePreview = () => {
  const experiences = [
    {
      id: 1,
      organization: 'Syrian Private University',
      position: 'Full-Time Lecturer and Project Mentor',
      period: 'September 2024 - Present',
      description: 'Develop and instruct lab courses including ROS, MATLAB, Proteus, and Arduino C. Mentor junior projects.'
    },
    {
      id: 2,
      organization: 'RoboTronics',
      position: 'Co-founder & Chief Technology Officer (CTO)',
      period: '2024 - Present',
      description: 'Spearheaded the launch of Syria\'s first solar panel cleaning robot, enhancing renewable energy maintenance solutions.'
    },
    {
      id: 3,
      organization: 'SEE (Syrian Engineers Expo)',
      position: 'Co-founder & IT Coordinator',
      period: '2024 - Present',
      description: 'Collaborated with UI/UX and development teams to deliver optimal functionality and user-centric design.'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Experience Highlights</h2>
          <Link 
            href="/experience" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{exp.organization}</h3>
              <h4 className="text-blue-600 font-medium mb-1">{exp.position}</h4>
              <p className="text-gray-500 text-sm mb-3">{exp.period}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencePreview;
