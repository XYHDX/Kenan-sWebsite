import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import { redis } from "@/lib/redis";
import { STORAGE_KEYS } from '@/lib/localStorage';

interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  description?: string;
}

const ExperiencePreview = async () => {
  // Default empty array
  let experiences: Experience[] = [];

  try {
    // Try to fetch from Redis
    const result = await redis.get<Experience[]>(STORAGE_KEYS.EXPERIENCE);
    if (result && result.length > 0) {
      // Only show first 4 items on the homepage preview
      experiences = result.slice(0, 4);
    }
  } catch (err) {
    console.error("Error fetching experience data:", err);
  }

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

        {experiences.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">Experience information will be available soon.</p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default ExperiencePreview;
