// Add dynamic export for allowing file uploads
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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

    // Create unique filename with appropriate extension
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    console.log(`🏷️ Generated filename: ${fileName}`);
    
    try {
      // Upload to Vercel Blob Storage
      console.log(`☁️ Uploading to Vercel Blob Storage...`);
      const blob = await put(fileName, file, {
        access: 'public',
        addRandomSuffix: false, // Use our generated UUID
      });
      
      console.log(`✅ File uploaded successfully to Blob Storage: ${blob.url}`);
      
      // Return the URL to the uploaded file
      return NextResponse.json({ 
        imageUrl: blob.url,
        success: true
      });
    } catch (uploadError: any) {
      console.error(`❌ Error uploading to Blob Storage:`, uploadError);
      return NextResponse.json(
        { error: `Error uploading to Blob Storage: ${uploadError.message}` },
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