// Add dynamic export for static site generation
export const dynamic = 'force-static';

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

// Default profile data for fallback
const defaultProfile: ProfileData = {
  name: 'Kenan Younes Saoud',
  title: 'Doctor of Dental Surgery',
  email: 'kenan.saoud@outlook.com',
  phone: '09639666005656',
  location: 'Damascus, Syria',
  summary: 'Specialized dental surgeon with PhD degree and extensive experience in oral and maxillofacial surgery (OMFS) and dental implantology.',
  profileImage: '/images/profile-pic.png'
};

// GET Handler: Fetch profile data from Redis
export async function GET() {
  try {
    console.log('🔍 GET /api/admin/profile: Fetching profile data from Redis');
    const profileData = await redis.get<ProfileData>(STORAGE_KEYS.PROFILE);
    
    if (!profileData || !profileData.name) {
      console.log('ℹ️ No profile data found in Redis, returning default profile');
      return NextResponse.json(defaultProfile, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    console.log('✅ Profile data found:', Object.keys(profileData));
    if (profileData.profileImage) {
      console.log('🖼️ Profile image found:', profileData.profileImage);
    }
    
    return NextResponse.json(profileData, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('❌ Error fetching profile data:', error);
    return NextResponse.json(
      defaultProfile,
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}

// POST Handler: Save profile data to Redis
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/profile: Saving profile data to Redis');
    const profileData = await request.json() as ProfileData;
    
    // Validate required fields
    if (!profileData.name || !profileData.title || !profileData.email) {
      console.error('❌ Missing required fields in profile data');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    console.log('📝 Profile data to save:', Object.keys(profileData));
    if (profileData.profileImage) {
      console.log('🖼️ Profile image URL:', 
        profileData.profileImage.length > 100 
          ? profileData.profileImage.substring(0, 100) + '...' 
          : profileData.profileImage
      );
    }
    
    // Save profile data to Redis
    const saveResult = await redis.set(STORAGE_KEYS.PROFILE, profileData);
    console.log('💾 Redis save result:', saveResult);
    
    // Double-check that the data was saved
    const verifyData = await redis.get<ProfileData>(STORAGE_KEYS.PROFILE);
    if (!verifyData || !verifyData.name) {
      console.error('❌ Verification failed: Could not retrieve saved profile data');
      return NextResponse.json(
        { error: 'Failed to verify saved data' },
        { status: 500 }
      );
    }
    
    console.log('✅ Profile data saved and verified successfully');
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      success: true
    });
  } catch (error) {
    console.error('❌ Error updating profile data:', error);
    return NextResponse.json(
      { error: 'Error updating profile data' },
      { status: 500 }
    );
  }
} 