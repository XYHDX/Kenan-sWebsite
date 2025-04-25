import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Briefcase, Calendar } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  description?: string;
  responsibilities?: string[];
  location?: string;
  startDate?: string;
  endDate?: string; 
  current?: boolean;
}

// Define the Redis key
const REDIS_EXPERIENCE_KEY = STORAGE_KEYS.EXPERIENCE;

// Make the component async to fetch data
const ExperiencePage = async () => {
  // Fetch experiences directly from Upstash Redis on the server
  let experiences: Experience[] = [];
  let error: string | null = null;

  try {
    // Fetch experiences from Upstash Redis using shared client
    const result = await redis.get<Experience[]>(REDIS_EXPERIENCE_KEY);
    experiences = result || [];
    console.log("Fetched experiences:", experiences);
  } catch (err) {
    console.error("Error fetching experiences from Upstash Redis:", err);
    error = "Failed to load experiences. Please try again later.";
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Professional Experience</h1>
          
          {error ? (
            <div className="text-center text-destructive text-xl py-10">{error}</div>
          ) : experiences.length === 0 ? (
            <div className="text-center text-muted-foreground text-xl py-10">No professional experience has been added yet.</div>
          ) : (
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <h2 className="text-xl font-semibold">{exp.organization}</h2>
                      <h3 className="text-primary font-medium mb-2">{exp.position}</h3>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <Calendar size={16} className="mr-2" />
                        <span>{exp.period}</span>
                      </div>
                      {exp.location && (
                        <div className="text-muted-foreground mb-2">
                          Location: {exp.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-2/3">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Briefcase size={18} className="mr-2 text-primary" />
                        Responsibilities
                      </h4>
                      <ul className="list-disc list-inside text-foreground space-y-2">
                        {exp.responsibilities && exp.responsibilities.length > 0 ? (
                          exp.responsibilities.map((responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          ))
                        ) : (
                          <li className="text-muted-foreground italic">No specific responsibilities listed.</li>
                        )}
                      </ul>
                      
                      {exp.description && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-foreground">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExperiencePage;
