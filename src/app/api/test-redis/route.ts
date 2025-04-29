import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function GET() {
  try {
    // Get Redis client
    const redis = getRedisClient();
    
    // Test Redis connection
    let pingResult;
    try {
      pingResult = await redis.ping();
    } catch (pingError) {
      console.error('Redis ping error:', pingError);
      return NextResponse.json({ 
        success: false, 
        error: 'Redis ping failed',
        details: String(pingError),
        env: {
          standardVars: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
          kvVars: !!process.env.UPSTASH_REDIS_KV_REST_API_URL && !!process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      ping: pingResult,
      env: {
        standardVars: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
        kvVars: !!process.env.UPSTASH_REDIS_KV_REST_API_URL && !!process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
      }
    });
  } catch (error) {
    console.error('Redis connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      env: {
        standardVars: !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN,
        kvVars: !!process.env.UPSTASH_REDIS_KV_REST_API_URL && !!process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
      }
    }, { status: 500 });
  }
} 