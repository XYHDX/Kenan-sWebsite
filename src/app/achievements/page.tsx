import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Trophy, Calendar, MapPin } from 'lucide-react';
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
const REDIS_ACHIEVEMENTS_KEY = STORAGE_KEYS.ACHIEVEMENTS; // Re-use key name for consistency

// Removed Redis initialization here

// Make the component async to fetch data
const AchievementsPage = async () => {
  // Fetch achievements directly from Upstash Redis on the server
  let achievements: Achievement[] = [];
  let isLoading = false; // Assume loading is false initially for server component
  let error: string | null = null;

  try {
    // Fetch achievements from Upstash Redis using shared client
    achievements = await redis.get<Achievement[]>(REDIS_ACHIEVEMENTS_KEY) || []; 
  } catch (err) {
    console.error("Error fetching achievements from Upstash Redis:", err);
    error = "Failed to load achievements. Please try again later.";
    isLoading = false; // Still false on error for server render
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Competitions & Achievements</h1>

          {error ? (
            <div className="text-center text-destructive text-xl py-10">{error}</div>
          ) : isLoading ? (
            <div className="text-center text-muted-foreground text-xl py-10">
              Loading achievements...
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center text-muted-foreground text-xl py-10">No achievements have been added yet.</div>
          ) : (
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="bg-card dark:bg-card rounded-lg shadow-sm border border-border p-4 flex flex-col md:flex-row justify-between items-center"
                >
                  <div className="md:w-1/4 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent dark:bg-accent flex items-center justify-center mb-4">
                      <Trophy size={36} className="text-primary dark:text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-center text-primary dark:text-primary-foreground">{achievement.title}</h2>
                  </div>

                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">{achievement.competition}</h3>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={16} className="mr-1" />
                        <span>{achievement.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar size={16} className="mr-1" />
                        <span>{achievement.year}</span>
                      </div>
                    </div>

                    <p className="text-card-foreground">{achievement.description || 'No description provided.'}</p>
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

export default AchievementsPage;