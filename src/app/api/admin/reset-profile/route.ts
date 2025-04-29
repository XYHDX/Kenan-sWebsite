// Add dynamic export for static site generation
export const dynamic = 'force-static';

import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';

export async function GET() {
  try {
    // Delete the profile data from Redis
    await redis.set(STORAGE_KEYS.PROFILE, null);
    
    console.log('Profile data has been reset');
    
    return NextResponse.json({ 
      message: 'Profile data has been reset successfully',
      success: true
    });
  } catch (error) {
    console.error('Error resetting profile data:', error);
    return NextResponse.json(
      { error: 'Error resetting profile data' },
      { status: 500 }
    );
  }
} 