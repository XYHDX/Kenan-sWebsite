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

// Default values to use when Redis returns empty values
const defaultContactData = {
  email: 'yahyademeriah@gmail.com',
  phone: '+971 58 127 7542',
  location: 'Dubai, UAE',
  linkedinUrl: 'https://linkedin.com/in/yahyademeriah',
  githubUrl: 'https://github.com/yahyademeriah',
  showContactForm: true
};

// GET Handler: Fetch contact data from Redis for public view
export async function GET() {
  try {
    const contact = await redis.get<ContactPublic>(REDIS_CONTACT_KEY);
    
    // If contact is null/undefined or missing required fields, use defaults
    if (!contact || !contact.email) {
      return NextResponse.json(defaultContactData);
    }
    
    // Ensure we only return public-facing data (not emailNotifications)
    // Use default values for any missing or empty fields
    const publicContact: ContactPublic = {
      email: contact.email || defaultContactData.email,
      phone: contact.phone || defaultContactData.phone,
      location: contact.location || defaultContactData.location,
      linkedinUrl: contact.linkedinUrl || defaultContactData.linkedinUrl,
      githubUrl: contact.githubUrl || defaultContactData.githubUrl,
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true
    };
    
    return NextResponse.json(publicContact);
  } catch (error) {
    console.error('🔥 GET /api/contact/data failed:', error);
    return NextResponse.json(defaultContactData, { status: 200 });
  }
} 