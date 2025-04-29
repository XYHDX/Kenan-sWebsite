import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';

const AchievementsPreview = () => {
  const achievements = [
    { id: 1, title: 'Course in ethitic veneers and smile designe.' },
    { id: 2, title: 'Courses in dental implantology (Implant Direct system, Bio-tem system, Megagen system).' },
    { id: 3, title: 'Certified from NHCPS in ACLS (Advanced Cardiac life support)' },
    { id: 4, title: 'Certified from NHCPS in BLS (Basic life support)' },
    { id: 5, title: 'Certified from pioneer denatal implants and bone grafting companies (Straumann - Nobel biocare - Zimmer Biomet - Biohorizons - Geistlich) for attending online courses.' },
    { id: 6, title: 'Supervisor and Trainer in a course of dental implantology- beginners level (Megagen dental implants system)' },
    { id: 7, title: 'Supervisor and Trainer in a course of dental implantology- beginners level (Hiossen dental implants system)' },
  ];

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Achievements & Awards</h2>
          <Link 
            href="/achievements" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <Award size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
                <h3 className="text-lg font-semibold">{achievement.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsPreview;
