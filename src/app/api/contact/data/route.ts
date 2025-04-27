import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';

// Contact interface for public view
interface ContactPublic {
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  showContactForm: boolean;
}

const REDIS_CONTACT_KEY = STORAGE_KEYS.CONTACT;

// GET Handler: Fetch contact data from Redis for public view
export async function GET() {
  try {
    const contact = await redis.get<ContactPublic>(REDIS_CONTACT_KEY) || {
      email: '',
      phone: '',
      location: '',
      showContactForm: true
    };
    
    // Ensure we only return public-facing data (not emailNotifications)
    const publicContact: ContactPublic = {
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      linkedinUrl: contact.linkedinUrl,
      githubUrl: contact.githubUrl,
      showContactForm: contact.showContactForm
    };
    
    return NextResponse.json(publicContact);
  } catch (error) {
    console.error('🔥 GET /api/contact/data failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
} 