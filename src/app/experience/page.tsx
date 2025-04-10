'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Briefcase, Calendar } from 'lucide-react';

const ExperiencePage = () => {
  const experiences = [
    {
      id: 1,
      organization: 'RoboTronics (Robotics & PCB Design)',
      position: 'Co-founder & Chief Technology Officer (CTO)',
      period: '2024 - Present',
      responsibilities: [
        'Spearheaded the launch of Syria\'s first solar panel cleaning robot, enhancing renewable energy maintenance solutions',
        'Managed the design and production of PCBs and 3D printed parts, optimizing manufacturing processes for efficiency and cost-effectiveness'
      ]
      
    },
    {
      id: 2,
      organization: 'Syrian Private University',
      position: 'Full-Time Lecturer and Project Mentor',
      period: 'September 2024 - Feb 2025',
      responsibilities: [
        'Develop and instruct lab courses including ROS, MATLAB, Proteus, Processing, 8086 Emulator, mikroC, and Arduino C',
        'Mentor junior projects, guiding students in project design, implementation, and technical presentation'
      ]
    },
    {
      id: 3,
      organization: 'SEE (Syrian Engineers Expo)',
      position: 'Co-founder & IT Coordinator',
      period: 'Jan 2024 - Jan 2025 ',
      responsibilities: [
        'Collaborated with UI/UX and development teams to deliver optimal functionality and user-centric design',
        'Coordinated with front-end and back-end developers to enhance platform stability, security, and user experience'
      ]
    },
    {
      id: 4,
      organization: 'Syra Robot',
      position: 'Trainer and Trainer of Trainers',
      period: 'June 2023 - Feb 2025',
      responsibilities: [
        'Trained both students and trainers in advanced robotics competition techniques, project strategy, and team management',
        'Facilitated team participation in WRO RoboMission category, enhancing skills in programming and mission planning',
        'Mentored teams, resulting in multiple awards and strengthened competencies in robotic applications'
      ]
    },
    {
      id: 5,
      organization: 'National Center for Distinguished (NCD)',
      position: 'Robotics Mentor',
      period: 'Apr 2023 - Apr 2025',
      responsibilities: [
        'Mentored teams for ARC, WRO, and Future Science Challenge, guiding competition preparation and skill development',
        'Developed tailored training modules to enhance students\' practical skills and problem-solving techniques in robotics'
      ]
    },
    {
      id: 6,
      organization: 'Levant Healthcare',
      position: 'IT Help Desk Specialist',
      period: '2021 - Present',
      responsibilities: [
        'Troubleshoot and resolve technical issues through remote support, ensuring customer satisfaction and system efficiency',
        'Provided comprehensive IT solutions, guiding users through complex problem-solving processes'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Professional Experience</h1>
          
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div 
                key={exp.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-900">{exp.organization}</h2>
                    <h3 className="text-blue-600 font-medium mb-2">{exp.position}</h3>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar size={16} className="mr-2" />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Briefcase size={18} className="mr-2 text-blue-600" />
                      Responsibilities
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {exp.responsibilities.map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;
