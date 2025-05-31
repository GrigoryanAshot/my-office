import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use a single database file for armchairs
const armchairsDataPath = path.join(process.cwd(), 'data', 'armchairs_database.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Initialize armchairs_database.json if it doesn't exist
if (!fs.existsSync(armchairsDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(armchairsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating armchairs_database.json:', error);
  }
}

export async function GET() {
  try {
    // Ensure file exists
    if (!fs.existsSync(armchairsDataPath)) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(armchairsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    }
    // Read and parse the file
    const data = fs.readFileSync(armchairsDataPath, 'utf8');
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      // If the file is corrupted, reset it
      const initialData = { items: [], types: [] };
      fs.writeFileSync(armchairsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
      parsedData = initialData;
    }
    // Ensure the response has the correct structure
    if (!parsedData || typeof parsedData !== 'object') {
      parsedData = { items: [], types: [] };
    }
    if (!Array.isArray(parsedData.items)) {
      parsedData.items = [];
    }
    if (!Array.isArray(parsedData.types)) {
      parsedData.types = [];
    }
    return NextResponse.json(parsedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read armchairs data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
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
    // Read current data from file
    let currentData;
    try {
      const fileContent = fs.readFileSync(armchairsDataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      currentData = { items: [], types: [] };
    }
    // Merge the new types with existing types
    const updatedData = {
      items: data.items,
      types: Array.from(new Set([...currentData.types, ...data.types]))
    };
    // Write the data to the file
    try {
      fs.writeFileSync(armchairsDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
    } catch (error) {
      return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 