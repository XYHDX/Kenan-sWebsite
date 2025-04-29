// Add dynamic export for static site generation
export const dynamic = 'force-static';

import { redis } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';

// Publications interface
interface Publication {
  id: string | number;
  title: string;
  description?: string;
  year?: string | number;
  authors?: string[];
  pdfUrl?: string;
}

// Default publications data for fallback
const defaultPublications: Publication[] = [
  {
    id: 1,
    title: "Evaluation of the Changes in Attached Gingival width after Simultaneous Dental Implantation with Calcium Sulfate Bone Grafting and Survival Rate of The Implants (Pre-Post Interventional Clinical Trial)",
    year: "2023"
  },
  {
    id: 2,
    title: "Reconstruction of Orbital Walls With 3D Printed Patient Specific Implant Using PEEK: A Case Report",
    year: "2022"
  },
  {
    id: 3,
    title: "Overall bone gaining after using calcium sulfate bone graft simultaneously to dental implantation (Clinical and Radiological study)",
    year: "2021"
  }
];

// Define the Redis key for publications
const REDIS_PUBLICATIONS_KEY = STORAGE_KEYS.PUBLICATIONS || 'kenan_publications_data';

// GET Handler: Fetch publications data from Redis
export async function GET() {
  try {
    console.log('🔍 GET /api/admin/publications: Fetching publications data from Redis');
    const publicationsData = await redis.get<Publication[]>(REDIS_PUBLICATIONS_KEY);
    
    if (!publicationsData || !Array.isArray(publicationsData) || publicationsData.length === 0) {
      console.log('ℹ️ No publications data found in Redis, returning default publications');
      return NextResponse.json(defaultPublications, {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    console.log(`✅ Publications data found: ${publicationsData.length} items`);
    return NextResponse.json(publicationsData, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('❌ Error fetching publications data:', error);
    return NextResponse.json(
      defaultPublications,
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

// POST Handler: Save publications data to Redis
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/publications: Saving publications data to Redis');
    const publicationsData = await request.json() as Publication[];
    
    // Validate data is an array
    if (!Array.isArray(publicationsData)) {
      console.error('❌ Invalid data format: publications data must be an array');
      return NextResponse.json(
        { error: 'Invalid data format: publications data must be an array' },
        { status: 400 }
      );
    }
    
    console.log(`📝 Publications data to save: ${publicationsData.length} items`);
    
    // Save publications data to Redis
    const saveResult = await redis.set(REDIS_PUBLICATIONS_KEY, publicationsData);
    console.log('💾 Redis save result:', saveResult);
    
    // Double-check that the data was saved
    const verifyData = await redis.get<Publication[]>(REDIS_PUBLICATIONS_KEY);
    if (!verifyData || !Array.isArray(verifyData) || verifyData.length === 0) {
      console.error('❌ Verification failed: Could not retrieve saved publications data');
      return NextResponse.json(
        { error: 'Failed to verify saved data' },
        { status: 500 }
      );
    }
    
    console.log('✅ Publications data saved and verified successfully');
    return NextResponse.json({ 
      message: 'Publications updated successfully',
      success: true
    });
  } catch (error) {
    console.error('❌ Error updating publications data:', error);
    return NextResponse.json(
      { error: 'Error updating publications data' },
      { status: 500 }
    );
  }
} 