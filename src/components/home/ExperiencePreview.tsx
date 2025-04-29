import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';

const ExperiencePreview = () => {
  const experiences = [
    {
      id: 1,
      organization: 'Self-employed',
      position: 'Doctor of dental surgery',
      period: 'June 2017 - Now',
      description: ''
    },
    {
      id: 2,
      organization: 'Safi Dental center',
      position: 'Surgeon',
      period: 'July 2018 - April 2020',
      description: 'Doctor of minor surgery and implantology - representative for dental implants companies'
    },
    {
      id: 3,
      organization: 'Ajaj Dental Center',
      position: 'Dental surgeon',
      period: 'July 2021 - July 2024',
      description: 'Part time'
    },
    {
      id: 4,
      organization: 'Aljabban Dental Center',
      position: 'Dental surgeon',
      period: 'August 2022 - Now',
      description: 'Part time'
    },
    {
      id: 5,
      organization: 'Al sorj dental center',
      position: 'Dental surgeon',
      period: 'December 2020 - Now',
      description: ''
    },
    {
      id: 6,
      organization: 'Diamond solitaire clinic syria',
      position: 'Oral surgeon',
      period: 'February 2023 - Now',
      description: ''
    }
  ];

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900" id="experience-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Experience</h2>
          <Link 
            href="/experience" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{exp.organization}</h3>
                  <h4 className="text-primary font-medium mb-1">{exp.position}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{exp.period}</p>
                  {exp.description && <p className="text-foreground">{exp.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/experience"
            className="inline-flex items-center justify-center rounded-md bg-primary text-white font-medium px-6 py-3 hover:bg-primary/90 transition-colors"
          >
            View Full Experience <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperiencePreview;
