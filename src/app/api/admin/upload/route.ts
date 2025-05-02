// Add dynamic export for allowing file uploads
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { redis } from '@/lib/redis';
import { STORAGE_KEYS } from '@/lib/localStorage';

// Max file size for Base64 encoding (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  console.log("🔍 Upload API called");
  try {
    // Get form data
    const formData = await request.formData();
    console.log("📋 Form data received");
    
    const file = formData.get('file') as File;
    if (!file) {
      console.error("❌ No file found in the form data");
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    console.log(`📁 File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      console.error(`❌ Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: 'Uploaded file must be an image' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(`❌ File too large: ${file.size} bytes (max: ${MAX_FILE_SIZE} bytes)`);
      return NextResponse.json(
        { error: `File size exceeds the maximum allowed size of 2MB` },
        { status: 400 }
      );
    }

    // Create unique filename with appropriate extension
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    console.log(`🏷️ Generated filename: ${fileName}`);
    
    try {
      // Convert file to Base64
      console.log(`📄 Converting file to Base64...`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');
      
      // Create data URL with MIME type
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      console.log(`✅ Converted to data URL, length: ${dataUrl.length} chars`);
      
      // Generate a key for this image in Redis
      const imageKey = `image:${fileName}`;
      
      // Store the image data in Redis
      await redis.set(imageKey, dataUrl);
      console.log(`✅ Image stored in Redis with key: ${imageKey}`);
      
      // Return the "virtual" URL that will reference this Redis key
      const imageUrl = `/api/images/${fileName}`;
      
      return NextResponse.json({ 
        imageUrl,
        success: true
      });
    } catch (uploadError: any) {
      console.error(`❌ Error storing image in Redis:`, uploadError);
      return NextResponse.json(
        { error: `Error storing image: ${uploadError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(`❌ Unhandled error in upload process:`, error);
    return NextResponse.json(
      { error: `Error uploading image: ${error.message}` },
      { status: 500 }
    );
  }
} 