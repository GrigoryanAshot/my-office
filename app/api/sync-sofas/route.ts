import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';
import fs from "fs";
import path from "path";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "sofas_database.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Store in Redis
    await redis.set('sofas:data', JSON.stringify(data));
    
    return NextResponse.json({
      success: true,
      message: 'Sofas data synced to Redis successfully!',
      itemsCount: data.items.length,
      typesCount: data.types.length
    });
  } catch (error) {
    console.error('Error syncing sofas data:', error);
    return NextResponse.json({ 
      error: 'Failed to sync sofas data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 