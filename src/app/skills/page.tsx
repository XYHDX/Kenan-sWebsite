import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Code, Server, Palette, Brain } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Skill interface
interface Skill {
  id: number | string;
  name: string;
  level: number;
  category: string;
  description?: string;
}

// Define the Redis key
const REDIS_SKILLS_KEY = STORAGE_KEYS.SKILLS;

// Function to get the appropriate icon for a skill category
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend':
      return <Palette className="text-primary" size={24} />;
    case 'backend':
      return <Server className="text-primary" size={24} />;
    case 'programming':
      return <Code className="text-primary" size={24} />;
    default:
      return <Brain className="text-primary" size={24} />;
  }
};

// Make the component async to fetch data
const SkillsPage = async () => {
  // Fetch skills directly from Upstash Redis on the server
  let skills: Skill[] = [];
  let error: string | null = null;

  try {
    // Fetch skills from Upstash Redis using shared client
    const result = await redis.get<Skill[]>(REDIS_SKILLS_KEY);
    skills = result || [];
    console.log("Fetched skills:", skills);
  } catch (err) {
    console.error("Error fetching skills from Upstash Redis:", err);
    error = "Failed to load skills. Please try again later.";
  }

  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = {};
  
  skills.forEach(skill => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = [];
    }
    groupedSkills[skill.category].push(skill);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Skills & Expertise</h1>

          {error ? (
            <div className="text-center text-destructive text-xl py-10">{error}</div>
          ) : Object.keys(groupedSkills).length === 0 ? (
            <div className="text-center text-muted-foreground text-xl py-10">No skills have been added yet.</div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="bg-card text-card-foreground rounded-lg shadow-md border border-border p-6">
                  <div className="flex items-center mb-6">
                    {getCategoryIcon(category)}
                    <h2 className="text-2xl font-semibold ml-2">{category}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex flex-col">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-lg">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        
                        <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        
                        {skill.description && (
                          <p className="text-muted-foreground text-sm mt-1">{skill.description}</p>
                        )}
                      </div>
                    ))}
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

export default SkillsPage;
