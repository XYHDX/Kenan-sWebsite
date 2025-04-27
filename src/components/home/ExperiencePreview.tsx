import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  description?: string;
  responsibilities?: string[];
}

// Define the Redis key
const REDIS_EXPERIENCE_KEY = STORAGE_KEYS.EXPERIENCE;

// Make the component async to fetch data
const ExperiencePreview = async () => {
  // Fetch experiences directly from Upstash Redis on the server
  let experiences: Experience[] = [];

  try {
    // Fetch experiences from Upstash Redis using shared client
    const result = await redis.get<Experience[]>(REDIS_EXPERIENCE_KEY);
    experiences = result || [];
  } catch (err) {
    console.error("Error fetching experiences from Upstash Redis:", err);
  }

  const previewExperiences = experiences.slice(0, 3);

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Experience Highlights</h2>
          <Link 
            href="/experience" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {previewExperiences.length === 0 ? (
           <div className="text-center text-muted-foreground">No experience highlights available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewExperiences.map((exp) => (
              <div 
                key={exp.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{exp.organization}</h3>
                <h4 className="text-primary font-medium mb-1">{exp.position}</h4>
                <p className="text-muted-foreground text-sm mb-3">{exp.period}</p>
                <p className="text-foreground">
                  {exp.description || exp.responsibilities?.[0] || 'Details available on the experience page.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperiencePreview;
