// Add dynamic export for allowing file uploads
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Make directories recursively with proper error handling
async function ensureDir(dir: string): Promise<boolean> {
  console.log(`🔍 Ensuring directory exists: ${dir}`);
  try {
    if (!fs.existsSync(dir)) {
      console.log(`📂 Creating directory: ${dir}`);
      await mkdir(dir, { recursive: true, mode: 0o777 });
      
      // Double-check it was created
      if (!fs.existsSync(dir)) {
        console.error(`❌ Failed to create directory: ${dir}`);
        return false;
      }
      
      // Set permissions explicitly
      fs.chmodSync(dir, 0o777);
      console.log(`✅ Directory created and permissions set: ${dir}`);
    } else {
      console.log(`✅ Directory already exists: ${dir}`);
      // Update permissions on existing directory
      fs.chmodSync(dir, 0o777);
    }
    
    // Test write permissions
    const testFile = path.join(dir, '.test-write');
    try {
      await writeFile(testFile, 'test');
      fs.unlinkSync(testFile); // Clean up test file
      console.log(`✅ Write permissions confirmed for: ${dir}`);
      return true;
    } catch (error: any) {
      console.error(`❌ Write permission test failed: ${error.message}`);
      return false;
    }
  } catch (error: any) {
    console.error(`❌ Error ensuring directory: ${error.message}`);
    return false;
  }
}

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

    // Create unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    console.log(`🏷️ Generated filename: ${fileName}`);
    
    // Get absolute path to the uploads directory
    const cwd = process.cwd();
    console.log(`📂 Current working directory: ${cwd}`);
    
    // Create path to public directory
    const publicDir = path.join(cwd, 'public');
    if (!(await ensureDir(publicDir))) {
      return NextResponse.json(
        { error: 'Server lacks permission to write to public directory' },
        { status: 500 }
      );
    }
    
    // Create path to uploads directory
    const uploadsDir = path.join(publicDir, 'uploads');
    if (!(await ensureDir(uploadsDir))) {
      return NextResponse.json(
        { error: 'Server lacks permission to write to uploads directory' },
        { status: 500 }
      );
    }

    // Convert file to buffer
    console.log(`📄 Converting file to buffer`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`✅ Buffer created, size: ${buffer.length} bytes`);
    
    // Full path where the file will be saved
    const filePath = path.join(uploadsDir, fileName);
    console.log(`📄 Target file path: ${filePath}`);
    
    try {
      // Save file to uploads directory
      console.log(`💾 Writing file to disk...`);
      await writeFile(filePath, buffer);
      console.log(`✅ File written successfully`);
      
      // Verify the file was written
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ File verified on disk, size: ${stats.size} bytes`);
      } else {
        console.error(`❌ File verification failed - file doesn't exist after write`);
        return NextResponse.json(
          { error: 'File write verification failed' },
          { status: 500 }
        );
      }
    } catch (writeError: any) {
      console.error(`❌ Error writing file: ${writeError}`);
      return NextResponse.json(
        { error: `Error saving file: ${writeError.message}` },
        { status: 500 }
      );
    }
    
    // Return the URL to the uploaded file
    const imageUrl = `/uploads/${fileName}`;
    console.log(`🔗 File uploaded successfully, URL: ${imageUrl}`);
    return NextResponse.json({ 
      imageUrl,
      success: true
    });
  } catch (error: any) {
    console.error(`❌ Unhandled error in upload process: ${error}`);
    return NextResponse.json(
      { error: `Error uploading image: ${error.message}` },
      { status: 500 }
    );
  }
} 