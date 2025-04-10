'use client';

import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';

const AchievementsPreview = () => {
  const achievements = [
    {
      id: 1,
      title: '1st Place',
      competition: 'Annual Robotic Competition (ARC)',
      location: 'Syria',
      year: '2024'
    },
    {
      id: 2,
      title: '3rd Place',
      competition: 'World Robotic Olympiad (WRO)',
      location: 'Syria, Future Innovators Category',
      year: '2024'
    },
    {
      id: 3,
      title: 'Coach',
      competition: 'World Robotic Olympiad (WRO)',
      location: 'RoboMission Senior Team',
      year: '2023'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Achievements</h2>
          <Link 
            href="/achievements" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <Trophy size={24} className="text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{achievement.title}</h3>
              </div>
              <h4 className="text-blue-600 font-medium mb-1">{achievement.competition}</h4>
              <p className="text-gray-700">{achievement.location}</p>
              <p className="text-gray-500 text-sm mt-2">{achievement.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsPreview;
