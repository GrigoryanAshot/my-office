import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Test reading the file
    const filePath = path.join(process.cwd(), "data", "takht_database.json");
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        error: 'Database file not found',
        filePath: filePath,
        cwd: process.cwd()
      }, { status: 404 });
    }
    
    // Try to read the file
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Check file permissions
    const stats = fs.statSync(filePath);
    
    return NextResponse.json({
      success: true,
      message: 'Database file is accessible',
      fileSize: stats.size,
      itemCount: data.items?.length || 0,
      typeCount: data.types?.length || 0,
      isWritable: (stats.mode & fs.constants.W_OK) !== 0,
      environment: process.env.NODE_ENV,
      cwd: process.cwd()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to access database', 
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV,
      cwd: process.cwd()
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test writing to the file
    const filePath = path.join(process.cwd(), "data", "takht_database.json");
    
    // Read current data
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    
    // Try to write the same data back (test write permissions)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Database file is writable',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to write to database', 
      details: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
} 