import { BarChart, CheckCircle } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name
import Link from 'next/link';

interface Skill {
  id: string | number;
  name: string;
  level: number;
  category: string;
}

// Define the Redis key
const REDIS_SKILLS_KEY = STORAGE_KEYS.SKILLS;

// Make the component async to fetch data
const SkillsPreview = async () => {
  // Fetch skills directly from Upstash Redis on the server
  let skills: Skill[] = [];

  try {
    // Fetch skills from Upstash Redis using shared client
    const result = await redis.get<Skill[]>(REDIS_SKILLS_KEY);
    skills = result || [];
  } catch (err) {
    console.error("Error fetching skills from Upstash Redis:", err);
  }

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  
  skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  // Get top categories
  const categories = Object.keys(skillsByCategory);
  const topCategories = categories.slice(0, 3);
  const otherSkills = categories.length > 3 
    ? categories.slice(3).flatMap(cat => skillsByCategory[cat])
    : [];
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Skills Overview</h2>
          <Link 
            href="/skills" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <BarChart size={16} className="ml-1" />
          </Link>
        </div>

        {skills.length === 0 ? (
          <div className="text-center text-muted-foreground">No skills available yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topCategories.map(category => (
                <div key={category} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
                  <h3 className="text-xl font-semibold mb-4">{category}</h3>
                  <div className="space-y-4">
                    {skillsByCategory[category].slice(0, 5).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {otherSkills.length > 0 && (
              <div className="mt-8 bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
                <h3 className="text-xl font-semibold mb-4">Other Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {otherSkills.slice(0, 6).map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <CheckCircle size={18} className="text-primary mr-2 flex-shrink-0" />
                      <span className="text-foreground">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsPreview;
