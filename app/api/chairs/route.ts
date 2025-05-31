import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use a single database file for chairs
const chairsDataPath = path.join(process.cwd(), 'data', 'chairs_database.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Initialize chairs_database.json if it doesn't exist
if (!fs.existsSync(chairsDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(chairsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating chairs_database.json:', error);
  }
}

export async function GET() {
  try {
    // Ensure file exists
    if (!fs.existsSync(chairsDataPath)) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(chairsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    }

    // Read and parse the file
    const data = fs.readFileSync(chairsDataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in GET /api/chairs:', error);
    return NextResponse.json({ error: 'Failed to read chairs data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    if (!Array.isArray(data.items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }

    if (!Array.isArray(data.types)) {
      return NextResponse.json({ error: 'Types must be an array' }, { status: 400 });
    }

    // Validate each item
    for (const item of data.items) {
      if (!item.url || !item.url.startsWith('/furniture/chairs/')) {
        return NextResponse.json({ error: 'Invalid item URL format - must be a chair item' }, { status: 400 });
      }
    }

    // Write the data to the file
    try {
      fs.writeFileSync(chairsDataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to chairs_database.json:', error);
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/chairs:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 