import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const wardrobesDataPath = path.join(process.cwd(), 'data', 'wardrobes_database.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

if (!fs.existsSync(wardrobesDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(wardrobesDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating wardrobes_database.json:', error);
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(wardrobesDataPath)) {
      return NextResponse.json({ error: 'Wardrobes data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(wardrobesDataPath, 'utf8');
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      return NextResponse.json({ error: 'Failed to parse wardrobes data' }, { status: 500 });
    }
    if (!parsedData || typeof parsedData !== 'object') parsedData = { items: [], types: [] };
    if (!Array.isArray(parsedData.items)) parsedData.items = [];
    if (!Array.isArray(parsedData.types)) parsedData.types = [];
    return NextResponse.json(parsedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read wardrobes data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    if (!Array.isArray(data.items)) return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    if (!Array.isArray(data.types)) return NextResponse.json({ error: 'Types must be an array' }, { status: 400 });
    let currentData;
    try {
      const fileContent = fs.readFileSync(wardrobesDataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      currentData = { items: [], types: [] };
    }
    const updatedData = {
      items: data.items,
      types: Array.from(new Set([...currentData.types, ...data.types]))
    };
    try {
      fs.writeFileSync(wardrobesDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
    } catch (error) {
      return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 