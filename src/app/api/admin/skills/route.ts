import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Skill interface
interface Skill {
  id: number | string;
  name: string;
  level: number;
  category: string;
  description?: string;
}

const REDIS_SKILLS_KEY = STORAGE_KEYS.SKILLS;

// GET Handler: Fetch skills from Redis using shared client
export async function GET() {
  try {
    const skills = await redis.get<Skill[]>(REDIS_SKILLS_KEY) || [];
    return NextResponse.json(skills);
  } catch (error) {
    console.error('🔥 GET /api/admin/skills failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save skills to Redis using shared client
export async function POST(request: NextRequest) {
  try {
    const skills: Skill[] = await request.json();
    if (!Array.isArray(skills)) {
       return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    await redis.set(REDIS_SKILLS_KEY, skills);
    return NextResponse.json({ message: 'Skills saved successfully' }, { status: 200 });

  } catch (error) {
    console.error("🔥 POST /api/admin/skills failed:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 