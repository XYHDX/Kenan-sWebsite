import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

interface Achievement {
  id: number | string;
  title: string;
  competition: string;
  location: string;
  year: string;
  description?: string;
}

// Define the Redis key
const REDIS_ACHIEVEMENTS_KEY = STORAGE_KEYS.ACHIEVEMENTS;

// Make the component async to fetch data
const AchievementsPreview = async () => {
  // Fetch achievements directly from Upstash Redis on the server
  let achievements: Achievement[] = [];

  try {
    // Fetch achievements from Upstash Redis using shared client
    const result = await redis.get<Achievement[]>(REDIS_ACHIEVEMENTS_KEY);
    achievements = result || [];
  } catch (err) {
    console.error("Error fetching achievements from Upstash Redis:", err);
  }

  const previewAchievements = achievements.slice(0, 3);

  return (
    <section className="py-12 bg-background/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Achievements</h2>
          <Link 
            href="/achievements" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {previewAchievements.length === 0 ? (
           <div className="text-center text-muted-foreground">No achievements available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <Trophy size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
                  <h3 className="text-xl font-semibold truncate">{achievement.title}</h3>
                </div>
                <h4 className="text-primary font-medium mb-1">{achievement.competition}</h4>
                <p className="text-foreground">{achievement.location}</p>
                <p className="text-muted-foreground text-sm mt-2">{achievement.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsPreview;
