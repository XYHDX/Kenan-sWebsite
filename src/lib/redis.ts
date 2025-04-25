import { Redis } from '@upstash/redis';

// Try to use the standard variables first, then fall back to the ones available in Vercel
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;

export const redis = new Redis({
  url: url!,
  token: token!,
}); 