// Add dynamic export for static site generation
export const dynamic = 'force-static';

import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Re-use the Achievement interface (consider moving to a shared types file later)
interface Achievement {
  id: number | string;
  title: string;
  competition: string;
  location: string;
  year: string;
  description?: string;
}

const REDIS_ACHIEVEMENTS_KEY = STORAGE_KEYS.ACHIEVEMENTS;

// GET Handler: Fetch achievements from Redis using shared client
export async function GET() {
  try {
    const achievements = await redis.get<Achievement[]>(REDIS_ACHIEVEMENTS_KEY) || [];
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('🔥 GET /api/admin/achievements failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save achievements to Redis using shared client
export async function POST(request: NextRequest) {
  try {
    const achievements: Achievement[] = await request.json();
    if (!Array.isArray(achievements)) {
       return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    await redis.set(REDIS_ACHIEVEMENTS_KEY, achievements);
    return NextResponse.json({ message: 'Achievements saved successfully' }, { status: 200 });

  } catch (error) {
    console.error("🔥 POST /api/admin/achievements failed:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 