# Fixing 404 NOT_FOUND Error on Vercel Deployment

This document provides step-by-step instructions to fix the 404 NOT_FOUND error that's occurring on your Vercel deployment.

## Problem Diagnosis

The 404 error is likely occurring due to one or more of the following issues:

1. Routing configuration in vercel.json
2. Next.js output configuration
3. Missing environment variables for Upstash Redis
4. Static export handling

## Solution Steps

### 1. Check Vercel Environment Variables

Ensure the following environment variables are set in your Vercel project dashboard (Settings > Environment Variables):

```
# Upstash Redis Configuration (Standard)
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# If using Vercel KV (Alternative)
UPSTASH_REDIS_KV_REST_API_URL=https://your-kv-url.upstash.io
UPSTASH_REDIS_KV_REST_API_TOKEN=your-kv-token

# Admin Authentication
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your-secure-password
```

### 2. Update Build Settings in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > General
3. Under "Build & Development Settings", set:
   - Build Command: `next build`
   - Output Directory: `out`
   - Install Command: `npm install` (or `pnpm install` if using pnpm)

### 3. Ensure Correct Vercel JSON Configuration

Make sure your `vercel.json` file has the following content:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ],
  "trailingSlash": false
}
```

### 4. Verify Next.js Configuration

Ensure your `next.config.ts` file includes:

```typescript
output: 'export',
distDir: 'out'
```

### 5. Add a Static Fallback Page

Create a `public/index.html` file that serves as a fallback for when Next.js routes aren't properly handled.

### 6. Redeploy with Framework Preset

1. Go to your Vercel project settings
2. Under "Framework Preset", ensure it's set to "Next.js"
3. Trigger a new deployment

### 7. Check for Cloudflare Conflicts

If you're using Cloudflare in front of Vercel, ensure:
- Caching settings aren't interfering with your application
- Page rules aren't redirecting your traffic incorrectly

### 8. Troubleshooting Redis Connections

If your application depends on Upstash Redis and you're still seeing issues:

1. Create a simple API endpoint to test Redis connectivity:

```typescript
// src/app/api/test-redis/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Test Redis connection
    const pingResult = await redis.ping();
    return NextResponse.json({ success: true, ping: pingResult });
  } catch (error) {
    console.error('Redis connection error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

2. After deploying, visit `/api/test-redis` to verify Redis connectivity

### 9. Final Check: Vercel Edge Configuration

For Next.js + Edge Runtime:
- Ensure your Edge configurations in Vercel are set correctly if you're using Edge functions or middleware

## Still Having Issues?

If the 404 error persists after following these steps:

1. Check Vercel deployment logs for specific error messages
2. Test with a minimal test page to isolate the issue
3. Consider switching to a different deployment strategy (such as Vercel serverless functions instead of static export)
4. Contact Vercel support with your deployment logs 