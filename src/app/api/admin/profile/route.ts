import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Profile interface
interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImage?: string;
}

// GET Handler: Fetch profile data from Redis
export async function GET() {
  try {
    const profileData = await redis.get<ProfileData>(STORAGE_KEYS.PROFILE);
    return NextResponse.json(profileData || {});
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Error fetching profile data' },
      { status: 500 }
    );
  }
}

// POST Handler: Save profile data to Redis
export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json() as ProfileData;
    
    // Validate required fields
    if (!profileData.name || !profileData.title || !profileData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save profile data to Redis
    await redis.set(STORAGE_KEYS.PROFILE, profileData);
    
    return NextResponse.json({ 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating profile data:', error);
    return NextResponse.json(
      { error: 'Error updating profile data' },
      { status: 500 }
    );
  }
} 