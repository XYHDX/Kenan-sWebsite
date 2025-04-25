import { Redis } from '@upstash/redis';

// Create a function that returns a Redis client
// This ensures the client is only created at runtime, not during build
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  // Only create the client once
  if (redisClient) return redisClient;
  
  // Function to get configuration based on available environment variables
  const getConfig = () => {
    // Check standard Upstash variables
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
      };
    }
    
    // Check Vercel KV variables
    if (process.env.UPSTASH_REDIS_KV_REST_API_URL && process.env.UPSTASH_REDIS_KV_REST_API_TOKEN) {
      return {
        url: process.env.UPSTASH_REDIS_KV_REST_API_URL,
        token: process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
      };
    }
    
    console.error('No Redis environment variables found');
    return null;
  };
  
  const config = getConfig();
  
  // If we have a valid configuration, create the client
  if (config) {
    redisClient = new Redis({
      url: config.url,
      token: config.token
    });
  } else {
    // Provide a dummy client that logs errors
    redisClient = {
      get: async () => {
        console.error('Redis client not properly initialized');
        return null;
      },
      set: async () => {
        console.error('Redis client not properly initialized');
        return null;
      },
      // Add other methods as dummy functions as needed
    } as unknown as Redis;
  }
  
  return redisClient;
}

// For backward compatibility
export const redis = {
  get: async function<T>(key: string): Promise<T | null> {
    return getRedisClient().get(key);
  },
  set: async function<T>(key: string, value: T): Promise<unknown> {
    return getRedisClient().set(key, value);
  }
  // Add other Redis methods you use in your application
}; 