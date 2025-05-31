import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use a single database file for takht
const takhtDataPath = path.join(process.cwd(), 'data', 'takht_database.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// Initialize takht_database.json if it doesn't exist
if (!fs.existsSync(takhtDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(takhtDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating takht_database.json:', error);
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(takhtDataPath)) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(takhtDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    }
    const data = fs.readFileSync(takhtDataPath, 'utf8');
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(takhtDataPath, JSON.stringify(initialData, null, 2), 'utf8');
      parsedData = initialData;
    }
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
    return NextResponse.json({ error: 'Failed to read takht data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    if (!Array.isArray(data.items)) {
      return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    }
    if (!Array.isArray(data.types)) {
      return NextResponse.json({ error: 'Types must be an array' }, { status: 400 });
    }
    let currentData;
    try {
      const fileContent = fs.readFileSync(takhtDataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      currentData = { items: [], types: [] };
    }
    const updatedData = {
      items: data.items,
      types: Array.from(new Set([...currentData.types, ...data.types]))
    };
    try {
      fs.writeFileSync(takhtDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
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