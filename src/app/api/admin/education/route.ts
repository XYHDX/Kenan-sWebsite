// Add dynamic export for static site generation
export const dynamic = 'force-static';

import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Education interface
interface Education {
  id: number | string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  location: string;
  description?: string;
}

interface Certification {
  id: number | string;
  title: string;
  organization: string;
  year: string;
  description?: string;
}

const REDIS_EDUCATION_KEY = STORAGE_KEYS.EDUCATION;
const REDIS_CERTIFICATIONS_KEY = STORAGE_KEYS.CERTIFICATIONS;

// GET Handler: Fetch education data from Redis
export async function GET(request: NextRequest) {
  try {
    // Get URL params to determine which data to fetch
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'certifications') {
      const certifications = await redis.get<Certification[]>(REDIS_CERTIFICATIONS_KEY) || [];
      return NextResponse.json(certifications);
    } else {
      // Default to education
      const education = await redis.get<Education[]>(REDIS_EDUCATION_KEY) || [];
      return NextResponse.json(education);
    }
  } catch (error) {
    console.error('🔥 GET /api/admin/education failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save education data to Redis
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const data = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    if (type === 'certifications') {
      await redis.set(REDIS_CERTIFICATIONS_KEY, data);
      return NextResponse.json({ message: 'Certifications saved successfully' }, { status: 200 });
    } else {
      // Default to education
      await redis.set(REDIS_EDUCATION_KEY, data);
      return NextResponse.json({ message: 'Education saved successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error("🔥 POST /api/admin/education failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 