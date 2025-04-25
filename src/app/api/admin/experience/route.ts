import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Experience interface
interface Experience {
  id: number | string;
  organization: string;
  position: string;
  period: string;
  location?: string;
  startDate?: string;
  endDate?: string; 
  current?: boolean;
  responsibilities: string[];
  description?: string;
}

const REDIS_EXPERIENCE_KEY = STORAGE_KEYS.EXPERIENCE;

// GET Handler: Fetch experience data from Redis
export async function GET() {
  try {
    const experiences = await redis.get<Experience[]>(REDIS_EXPERIENCE_KEY) || [];
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('🔥 GET /api/admin/experience failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save experience data to Redis
export async function POST(request: NextRequest) {
  try {
    const experiences: Experience[] = await request.json();
    if (!Array.isArray(experiences)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    await redis.set(REDIS_EXPERIENCE_KEY, experiences);
    return NextResponse.json({ message: 'Experience saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/experience failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 