// Import the Redis library
const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const envVars = {};

// Parse environment variables
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('Parsed environment variables:', envVars);

// Create Redis client
const redis = new Redis({
  url: envVars.UPSTASH_REDIS_REST_URL,
  token: envVars.UPSTASH_REDIS_REST_TOKEN,
});

// Sample achievements data
const sampleData = [
  {
    id: 1,
    title: '1st Place',
    competition: 'Web Development Contest',
    location: 'Dubai, UAE',
    year: '2023',
    description: 'Won first place in the annual web development competition.'
  },
  {
    id: 2,
    title: '2nd Place',
    competition: 'Hackathon 2022',
    location: 'Abu Dhabi, UAE',
    year: '2022',
    description: 'Runner-up in the national hackathon event.'
  }
];

// Import the data to Redis
async function importData() {
  try {
    // Test Redis connection
    const pingResult = await redis.ping();
    console.log('Redis connection test:', pingResult);
    
    // Import the data
    await redis.set('achievements_data', sampleData);
    console.log('Sample achievements data imported successfully!');
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the import function
importData(); 