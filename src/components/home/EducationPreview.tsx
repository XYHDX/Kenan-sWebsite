import { GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const EducationPreview = () => {
  const education = [
    {
      id: 1,
      institution: 'Faculty of Dentistry - Damascus university',
      degree: 'PhD Degree',
      field: 'Dentistry',
      period: 'May 2022 - November 2024',
      honors: 'Honor'
    },
    {
      id: 2,
      institution: 'Damascus university',
      degree: 'Master degree in OMFS',
      field: 'Dentistry',
      period: '2017 - 2021'
    },
    {
      id: 3,
      institution: 'Faculty of Dentistry - Damascus university',
      degree: 'Bachelor Degree',
      field: 'Dentistry',
      period: '2011 - 2016'
    }
  ];

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900" id="education-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Education</h2>
          <Link 
            href="/education" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {education.map(edu => (
            <div key={edu.id} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/6 flex justify-center md:justify-start">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                </div>
                <div className="md:w-5/6">
                  <h3 className="text-lg font-semibold">{edu.institution}</h3>
                  <h4 className="text-primary font-medium">{edu.degree}</h4>
                  {edu.honors && <p className="text-foreground">{edu.honors}</p>}
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Calendar size={14} className="mr-2" />
                    <span>{edu.period}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationPreview;
