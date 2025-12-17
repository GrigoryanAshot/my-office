import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DATA_KEY = 'stands:data';

export async function POST() {
  try {
    // Read data from file
    const filePath = path.join(process.cwd(), "data", "stands_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Save to Redis
    await redis.set(DATA_KEY, data);
    
    // Verify the data was saved
    const savedData = await redis.get(DATA_KEY);
    
    return NextResponse.json({
      success: true,
      message: 'Stands data migrated to Redis successfully',
      itemsCount: data.items?.length || 0,
      typesCount: data.types?.length || 0,
      savedData: savedData
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to migrate data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if data exists in Redis
    const redisData = await redis.get(DATA_KEY);
    
    // Read data from file for comparison
    const filePath = path.join(process.cwd(), "data", "stands_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const fileData = JSON.parse(fileContents);
    
    return NextResponse.json({
      redisData: redisData,
      fileData: fileData,
      hasRedisData: !!redisData,
      hasFileData: !!fileData
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check migration status', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 