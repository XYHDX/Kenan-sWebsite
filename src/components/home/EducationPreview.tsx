import { GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { redis } from "@/lib/redis";
import { STORAGE_KEYS } from '@/lib/localStorage';

interface Education {
  id: number | string;
  institution: string;
  degree: string;
  field?: string;
  period: string;
  honors?: string;
}

const EducationPreview = async () => {
  // Default empty array
  let education: Education[] = [];

  try {
    // Try to fetch from Redis
    const result = await redis.get<Education[]>(STORAGE_KEYS.EDUCATION);
    if (result && result.length > 0) {
      // Only show first 3 items on the homepage preview
      education = result.slice(0, 3);
    }
  } catch (err) {
    console.error("Error fetching education data:", err);
  }

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
        
        {education.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">Education information will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/6 flex justify-center">
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
        )}
      </div>
    </section>
  );
};

export default EducationPreview;
