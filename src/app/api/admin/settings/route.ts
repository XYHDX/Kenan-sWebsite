import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Site settings interface
interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  enableDarkMode: boolean;
  enablePublicProfile: boolean;
  enableSEO: boolean;
  maintenanceMode: boolean;
  customTheme: string;
  maxItemsPerPage: number;
  analyticsId?: string;
  customCss?: string;
}

const REDIS_SETTINGS_KEY = STORAGE_KEYS.SETTINGS;

// GET Handler: Fetch settings from Redis
export async function GET() {
  try {
    const settings = await redis.get<SiteSettings>(REDIS_SETTINGS_KEY) || {
      siteName: 'My Portfolio',
      siteDescription: 'Personal portfolio website',
      siteLanguage: 'en',
      enableDarkMode: true,
      enablePublicProfile: true,
      enableSEO: true,
      maintenanceMode: false,
      customTheme: 'default',
      maxItemsPerPage: 10
    };
    return NextResponse.json(settings);
  } catch (error) {
    console.error('🔥 GET /api/admin/settings failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save settings to Redis
export async function POST(request: NextRequest) {
  try {
    const settings: SiteSettings = await request.json();
    
    // Validate required fields
    if (!settings.siteName) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }
    
    await redis.set(REDIS_SETTINGS_KEY, settings);
    return NextResponse.json({ message: 'Settings saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/settings failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 