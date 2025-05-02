// Serve images from Redis
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const imageKey = `image:${filename}`;
    
    // Fetch image data from Redis
    const imageData = await redis.get<string>(imageKey);
    
    if (!imageData) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Check if it's a data URL starting with data:image/
    if (imageData.startsWith('data:image/')) {
      // Split the data URL to get content type and base64 data
      const [metaPart, base64Data] = imageData.split(',');
      const contentType = metaPart.split(':')[1].split(';')[0];
      
      // Decode base64 data
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Return image with proper content type
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      // If not a proper data URL, return the URL directly (might be a remote URL)
      return NextResponse.redirect(imageData);
    }
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
} 