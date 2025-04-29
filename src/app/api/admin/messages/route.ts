// Add dynamic export for static site generation
export const dynamic = 'force-static';

import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Message interface
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const REDIS_MESSAGES_KEY = STORAGE_KEYS.MESSAGES;

// GET Handler: Fetch messages from Redis
export async function GET() {
  try {
    const messages = await redis.get<Message[]>(REDIS_MESSAGES_KEY) || [];
    return NextResponse.json(messages);
  } catch (error) {
    console.error('🔥 GET /api/admin/messages failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// PUT Handler: Update message (mark as read)
export async function PUT(request: NextRequest) {
  try {
    const { id, read } = await request.json() as { id: string; read: boolean };
    
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }
    
    const messages = await redis.get<Message[]>(REDIS_MESSAGES_KEY) || [];
    
    // Find and update the message
    const updatedMessages = messages.map(message => {
      if (message.id === id) {
        return { ...message, read };
      }
      return message;
    });
    
    await redis.set(REDIS_MESSAGES_KEY, updatedMessages);
    
    return NextResponse.json({ success: true, message: 'Message updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('🔥 PUT /api/admin/messages failed:', error);
    return NextResponse.json({ error: 'Internal Server Error updating message' }, { status: 500 });
  }
}

// DELETE Handler: Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json() as { id: string };
    
    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }
    
    const messages = await redis.get<Message[]>(REDIS_MESSAGES_KEY) || [];
    
    // Filter out the message with the given ID
    const updatedMessages = messages.filter(message => message.id !== id);
    
    await redis.set(REDIS_MESSAGES_KEY, updatedMessages);
    
    return NextResponse.json({ success: true, message: 'Message deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('🔥 DELETE /api/admin/messages failed:', error);
    return NextResponse.json({ error: 'Internal Server Error deleting message' }, { status: 500 });
  }
} 