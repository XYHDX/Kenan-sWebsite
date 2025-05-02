import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { STORAGE_KEYS } from '@/lib/localStorage';
import crypto from 'crypto';

// Type for gallery items
interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  imagePath: string;
  date?: string;
}

// Function to generate a unique ID
function generateId(): string {
  return crypto.randomUUID();
}

// GET: Retrieve all gallery items
export async function GET(request: NextRequest) {
  try {
    // Fetch gallery items from Redis
    const galleryItems = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY);
    
    // Return empty array if no items found
    if (!galleryItems) {
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(galleryItems, { status: 200 });
  } catch (error) {
    console.error("Error retrieving gallery items:", error);
    return NextResponse.json({ error: "Failed to retrieve gallery items" }, { status: 500 });
  }
}

// POST: Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const newItemData = await request.json() as {
      title: string;
      description?: string;
      imagePath: string;
      date?: string;
    };
    
    // Validate required fields
    if (!newItemData.title || !newItemData.imagePath) {
      return NextResponse.json(
        { error: "Title and image path are required" },
        { status: 400 }
      );
    }
    
    // Fetch existing items
    const existingItems = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY) || [];
    
    // Create new item with unique ID
    const itemToSave: GalleryItem = {
      ...newItemData,
      id: generateId(),
      date: newItemData.date || new Date().toISOString().split('T')[0]
    };
    
    // Add new item to the list
    const updatedItems = [...existingItems, itemToSave];
    
    // Save updated list to Redis
    await redis.set(STORAGE_KEYS.GALLERY, updatedItems);
    
    return NextResponse.json(itemToSave, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
} 