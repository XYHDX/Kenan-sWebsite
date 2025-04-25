import { Redis } from '@upstash/redis';

// Try different environment variable combinations
// First try standard variables, then Vercel KV variables
const getRedisConfig = () => {
  // Standard Upstash Redis variables
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    };
  }
  
  // Vercel KV variables
  if (process.env.UPSTASH_REDIS_KV_REST_API_URL && process.env.UPSTASH_REDIS_KV_REST_API_TOKEN) {
    return {
      url: process.env.UPSTASH_REDIS_KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
    };
  }
  
  // Fallback to empty strings but log an error
  console.error('Redis environment variables not found');
  return {
    url: '',
    token: ''
  };
};

const config = getRedisConfig();

export const redis = new Redis({
  url: config.url,
  token: config.token,
}); 