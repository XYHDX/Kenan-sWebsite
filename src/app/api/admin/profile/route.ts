import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Profile interface
interface Profile {
  name: string;
  title: string;
  summary: string;
  photoUrl?: string;
  headerImage?: string;
  bio?: string;
  location?: string;
  availability?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

const REDIS_PROFILE_KEY = STORAGE_KEYS.PROFILE;

// GET Handler: Fetch profile data from Redis
export async function GET() {
  try {
    const profile = await redis.get<Profile>(REDIS_PROFILE_KEY) || {
      name: '',
      title: '',
      summary: '',
    };
    return NextResponse.json(profile);
  } catch (error) {
    console.error('🔥 GET /api/admin/profile failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save profile data to Redis
export async function POST(request: NextRequest) {
  try {
    const profile: Profile = await request.json();
    
    // Validate required fields
    if (!profile.name || !profile.title) {
      return NextResponse.json({ error: 'Name and title are required' }, { status: 400 });
    }
    
    await redis.set(REDIS_PROFILE_KEY, profile);
    return NextResponse.json({ message: 'Profile saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/profile failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 