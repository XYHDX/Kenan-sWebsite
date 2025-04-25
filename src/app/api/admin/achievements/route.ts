import { Redis } from '@upstash/redis'; // Import Upstash Redis
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

// Initialize Redis client
const redis = Redis.fromEnv();

// Basic Authentication Check Function
function authenticateRequest(req: NextRequest): boolean {
  const basicAuth = req.headers.get('authorization');
  if (!basicAuth) return false;

  try {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

    const expectedUser = process.env.BASIC_AUTH_USER;
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

    return user === expectedUser && pwd === expectedPassword;
  } catch (error) {
    console.error("Error decoding auth header:", error);
    return false;
  }
}

// GET Handler: Fetch achievements from Redis
export async function GET(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const achievements = await redis.get<Achievement[]>(REDIS_ACHIEVEMENTS_KEY) || [];
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Redis GET Error:", error);
    return new NextResponse('Internal Server Error retrieving data', { status: 500 });
  }
}

// POST Handler: Save achievements to Redis
export async function POST(request: NextRequest) {
  if (!authenticateRequest(request)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const achievements: Achievement[] = await request.json();
    // Basic validation (could be more robust, e.g., using Zod)
    if (!Array.isArray(achievements)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }
    
    // Use redis.set to save the data
    await redis.set(REDIS_ACHIEVEMENTS_KEY, achievements);
    return NextResponse.json({ message: 'Achievements saved successfully' }, { status: 200 });

  } catch (error) {
    console.error("Redis SET Error or JSON parsing error:", error);
    if (error instanceof SyntaxError) {
        return new NextResponse('Bad Request: Invalid JSON', { status: 400 });
    }
    return new NextResponse('Internal Server Error saving data', { status: 500 });
  }
} 