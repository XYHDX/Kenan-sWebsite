import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Contact interface
interface Contact {
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  showContactForm: boolean;
  emailNotifications: boolean;
}

const REDIS_CONTACT_KEY = STORAGE_KEYS.CONTACT;

// GET Handler: Fetch contact data from Redis
export async function GET() {
  try {
    const contact = await redis.get<Contact>(REDIS_CONTACT_KEY) || {
      email: '',
      showContactForm: true,
      emailNotifications: false
    };
    return NextResponse.json(contact);
  } catch (error) {
    console.error('🔥 GET /api/admin/contact failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save contact data to Redis
export async function POST(request: NextRequest) {
  try {
    const contact: Contact = await request.json();
    
    // Validate required fields
    if (!contact.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    await redis.set(REDIS_CONTACT_KEY, contact);
    return NextResponse.json({ message: 'Contact information saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/contact failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 