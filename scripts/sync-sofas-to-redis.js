const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function syncSofasToRedis() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "sofas_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Store in Redis
    await redis.set('sofas:data', JSON.stringify(data));
    
    console.log('Sofas data synced to Redis successfully!');
    console.log('Items count:', data.items.length);
    console.log('Types count:', data.types.length);
  } catch (error) {
    console.error('Error syncing sofas data:', error);
  }
}

syncSofasToRedis(); 