'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Trophy, Calendar, MapPin } from 'lucide-react';

const AchievementsPage = () => {
  const achievements = [
    {
      id: 1,
      title: '1st Place',
      competition: 'Annual Robotic Competition (ARC)',
      location: 'Syria',
      year: '2024',
      description: 'Recognized for innovative robotics design and exceptional performance in the competition.'
    },
    {
      id: 2,
      title: '3rd Place',
      competition: 'World Robotic Olympiad (WRO)',
      location: 'Syria, Future Innovators Category',
      year: '2024',
      description: 'Awarded for creative problem-solving and technical implementation in the Future Innovators category.'
    },
    {
      id: 3,
      title: 'Coach',
      competition: 'World Robotic Olympiad (WRO)',
      location: 'RoboMission Senior Team',
      year: '2023',
      description: 'Successfully coached and mentored the senior team, developing their technical and strategic skills for the competition.'
    },
    {
      id: 4,
      title: 'Participant',
      competition: 'Future Science Challenge',
      location: 'UAE',
      year: '2024',
      description: 'Represented Syria in this international science and technology challenge, showcasing innovative solutions.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Competitions & Achievements</h1>
          
          <div className="space-y-8">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Trophy size={36} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-center text-gray-900">{achievement.title}</h2>
                  </div>
                  
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.competition}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        <span>{achievement.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-1" />
                        <span>{achievement.year}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{achievement.description}</p>
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

export default AchievementsPage;
