import Link from 'next/link';
import { Award, ArrowRight } from 'lucide-react';
import { redis } from "@/lib/redis";
import { STORAGE_KEYS } from '@/lib/localStorage';

interface Achievement {
  id: number | string;
  title: string;
}

const AchievementsPreview = async () => {
  // Default empty array
  let achievements: Achievement[] = [];

  try {
    // Try to fetch from Redis
    const result = await redis.get<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
    if (result && result.length > 0) {
      // Only show first 5 items on the homepage preview
      achievements = result.slice(0, 5);
    }
  } catch (err) {
    console.error("Error fetching achievements data:", err);
  }

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900" id="achievements-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Achievements & Awards</h2>
          <Link 
            href="/achievements" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">Achievements information will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <Award size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
                  <h3 className="text-lg font-semibold">{achievement.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsPreview;
