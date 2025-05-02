import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SkillsPreview = () => {
  const skills = [
    { id: 1, name: 'ICDL (international computer driving licence) since 2017', category: 'Computer Skills' },
    { id: 2, name: 'Teaching and communicating skills', category: 'Professional Skills' },
    { id: 3, name: 'Problem solving and decision making', category: 'Professional Skills' },
  ];

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900" id="skills-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Skills</h2>
          <Link 
            href="/skills" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <li key={skill.id} className="flex items-center">
                <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0" />
                <span className="text-foreground">{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SkillsPreview;
