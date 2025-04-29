// Add dynamic export for static site generation
export const dynamic = 'force-static';

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

// Default contact data to use when missing
const defaultContactData = {
  email: 'yahyademeriah@gmail.com',
  phone: '+971 58 127 7542',
  location: 'Dubai, UAE',
  linkedinUrl: 'https://linkedin.com/in/yahyademeriah',
  githubUrl: 'https://github.com/yahyademeriah',
  showContactForm: true,
  emailNotifications: true
};

// GET Handler: Fetch contact data from Redis
export async function GET() {
  try {
    const contact = await redis.get<Contact>(REDIS_CONTACT_KEY);
    
    if (!contact || !contact.email) {
      return NextResponse.json(defaultContactData);
    }
    
    // Fill in any missing fields with defaults
    const completeContact = {
      email: contact.email || defaultContactData.email,
      phone: contact.phone || defaultContactData.phone,
      location: contact.location || defaultContactData.location,
      linkedinUrl: contact.linkedinUrl || defaultContactData.linkedinUrl,
      githubUrl: contact.githubUrl || defaultContactData.githubUrl,
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true,
      emailNotifications: typeof contact.emailNotifications === 'boolean' ? contact.emailNotifications : true
    };
    
    return NextResponse.json(completeContact);
  } catch (error) {
    console.error('🔥 GET /api/admin/contact failed:', error);
    return NextResponse.json(defaultContactData);
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
    
    // Ensure all boolean fields are properly set
    const sanitizedContact = {
      ...contact,
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true,
      emailNotifications: typeof contact.emailNotifications === 'boolean' ? contact.emailNotifications : true
    };
    
    // Save to Redis
    await redis.set(REDIS_CONTACT_KEY, sanitizedContact);
    
    // Also log for debugging
    console.log('Saving contact data to Redis:', sanitizedContact);
    
    return NextResponse.json({ message: 'Contact information saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/contact failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 