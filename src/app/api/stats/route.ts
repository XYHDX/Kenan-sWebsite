import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// Key for storing site views
const SITE_VIEWS_KEY = 'kenan_site_views';

export async function GET() {
    try {
        const views = await redis.get<number>(SITE_VIEWS_KEY) || 0;

        return NextResponse.json({
            views,
            success: true
        });
    } catch (error) {
        console.error('Error fetching site stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        // Increment view count
        const newCount = await redis.incr(SITE_VIEWS_KEY);

        return NextResponse.json({
            views: newCount,
            success: true
        });
    } catch (error) {
        console.error('Error updating site stats:', error);
        return NextResponse.json(
            { error: 'Failed to update stats' },
            { status: 500 }
        );
    }
}
