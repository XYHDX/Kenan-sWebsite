'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Calendar, Award } from 'lucide-react';

const EducationPage = () => {
  const education = {
    degree: 'Bachelor of Engineering',
    institution: 'Syrian Private University',
    period: '2016 - 2024',
    project: 'Waste Sorting System Using Object Detection',
    details: [
      'Developed an automated system for waste classification and sorting, utilizing object detection',
      'Integrated a mechanical sorting mechanism, achieving a 40% efficiency improvement in waste segregation'
    ]
  };

  const certifications = [
    {
      id: 1,
      title: 'Take the Lead Program',
      organization: 'Cornell University',
      year: '2023'
    },
    {
      id: 2,
      title: 'Certified Lego EV3 Trainer',
      organization: 'Syrian Robotic Academy',
      year: '2023'
    },
    {
      id: 3,
      title: 'Advertising Design Program',
      organization: 'Youth Empowerment Program',
      year: '2021'
    },
    {
      id: 4,
      title: 'Cisco CCNA R&S',
      organization: 'NGO Egypt',
      year: '2018'
    },
    {
      id: 5,
      title: 'Engineering and Maintenance of Computer Networks',
      organization: 'Asia Training Center',
      year: '2018'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Education & Certifications</h1>
          
          {/* Education Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <GraduationCap size={24} className="mr-2 text-blue-600" />
              Education
            </h2>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-gray-900">{education.degree}</h3>
                  <h4 className="text-blue-600 font-medium mb-2">{education.institution}</h4>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Calendar size={16} className="mr-2" />
                    <span>{education.period}</span>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                    <h5 className="font-medium text-gray-900 mb-4">Project: {education.project}</h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {education.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Certifications Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Award size={24} className="mr-2 text-blue-600" />
              Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{cert.title}</h3>
                  <p className="text-blue-600 mb-1">{cert.organization}</p>
                  <p className="text-gray-500 text-sm">{cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducationPage;
