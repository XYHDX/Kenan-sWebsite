'use client';

import { GraduationCap, Calendar } from 'lucide-react';

const EducationPreview = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Education & Certifications</h2>
        
        <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <GraduationCap size={36} className="text-primary" />
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bachelor of Engineering</h3>
              <h4 className="text-primary font-medium mb-2">Syrian Private University</h4>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                <Calendar size={16} className="mr-2" />
                <span>2016 - 2024</span>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-100 dark:border-gray-600">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Project: Waste Sorting System Using Object Detection</h5>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Developed an automated system for waste classification and sorting, utilizing object detection</li>
                  <li>Integrated a mechanical sorting mechanism, achieving a 40% efficiency improvement in waste segregation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Take the Lead Program</h3>
            <p className="text-primary mb-1">Cornell University</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">2023</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Certified Lego EV3 Trainer</h3>
            <p className="text-primary mb-1">Syrian Robotic Academy</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">2023</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Advertising Design Program</h3>
            <p className="text-primary mb-1">Youth Empowerment Program</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">2021</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cisco CCNA R&S</h3>
            <p className="text-primary mb-1">NGO Egypt</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">2018</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationPreview;
