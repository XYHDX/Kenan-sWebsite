import { redis } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';

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

// Form data interface
interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const REDIS_MESSAGES_KEY = STORAGE_KEYS.MESSAGES;

// POST Handler: Save message from contact form
export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as ContactFormData;
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' }, 
        { status: 400 }
      );
    }
    
    // Create a new message object
    const newMessage: Message = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      subject: data.subject || '',
      message: data.message,
      date: new Date().toISOString(),
      read: false
    };
    
    // Get existing messages
    const existingMessages = await redis.get<Message[]>(REDIS_MESSAGES_KEY) || [];
    
    // Add new message to the list
    const updatedMessages = [newMessage, ...existingMessages];
    
    // Save to Redis
    await redis.set(REDIS_MESSAGES_KEY, updatedMessages);
    
    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully!' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 POST /api/contact failed:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' }, 
      { status: 500 }
    );
  }
} 