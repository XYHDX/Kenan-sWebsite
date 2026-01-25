// Add dynamic export for static site generation
// Add dynamic export for static site generation
export const dynamic = 'force-dynamic';

import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';

// Contact interface for public view
interface ContactPublic {
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  showContactForm: boolean;
}

const REDIS_CONTACT_KEY = STORAGE_KEYS.CONTACT;

// Default values to use when Redis returns empty values
const defaultContactData = {
  email: 'kenan.saoud@outlook.com',
  phone: '09639666005656',
  location: 'Damascus, Syria',
  linkedinUrl: 'https://linkedin.com/in/Kenan.saoud',
  instagramUrl: 'https://instagram.com/Kenan.saoud',
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
      instagramUrl: contact.instagramUrl || defaultContactData.instagramUrl,
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true
    };

    return NextResponse.json(publicContact, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('🔥 GET /api/contact/data failed:', error);
    return NextResponse.json(defaultContactData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 