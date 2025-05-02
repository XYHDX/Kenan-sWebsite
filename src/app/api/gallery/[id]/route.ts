import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { STORAGE_KEYS } from '@/lib/localStorage';

// Type for gallery items
interface GalleryItem {
  id: string | number;
  title: string;
  description?: string;
  imagePath: string;
  date?: string;
}

// GET: Retrieve a specific gallery item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch gallery items from Redis
    const galleryItems = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY) || [];
    
    // Find the requested item
    const item = galleryItems.find(item => item.id.toString() === id);
    
    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error(`Error retrieving gallery item (ID: ${params.id}):`, error);
    return NextResponse.json({ error: "Failed to retrieve gallery item" }, { status: 500 });
  }
}

// PUT: Update a specific gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedItem: GalleryItem = await request.json();
    
    // Validate required fields
    if (!updatedItem.title || !updatedItem.imagePath) {
      return NextResponse.json(
        { error: "Title and image path are required" },
        { status: 400 }
      );
    }
    
    // Fetch gallery items from Redis
    const galleryItems = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY) || [];
    
    // Find the index of the item to update
    const itemIndex = galleryItems.findIndex(item => item.id.toString() === id);
    
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    
    // Update the item
    const updatedItems = [...galleryItems];
    updatedItems[itemIndex] = {
      ...updatedItem,
      id // Ensure ID remains the same
    };
    
    // Save updated list to Redis
    await redis.set(STORAGE_KEYS.GALLERY, updatedItems);
    
    return NextResponse.json(updatedItems[itemIndex], { status: 200 });
  } catch (error) {
    console.error(`Error updating gallery item (ID: ${params.id}):`, error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

// DELETE: Remove a specific gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch gallery items from Redis
    const galleryItems = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY) || [];
    
    // Check if the item exists
    const itemExists = galleryItems.some(item => item.id.toString() === id);
    
    if (!itemExists) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }
    
    // Filter out the item to delete
    const updatedItems = galleryItems.filter(item => item.id.toString() !== id);
    
    // Save updated list to Redis
    await redis.set(STORAGE_KEYS.GALLERY, updatedItems);
    
    return NextResponse.json({ success: true, message: "Gallery item deleted" }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting gallery item (ID: ${params.id}):`, error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
} 