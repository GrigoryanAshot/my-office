import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'podium_database.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize the file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ items: [], types: [] }));
}

// Helper function to ensure valid data structure
function ensureValidData(data: any) {
  if (!data || typeof data !== 'object') {
    return { items: [], types: [] };
  }
  return {
    items: Array.isArray(data.items) ? data.items : [],
    types: Array.isArray(data.types) ? data.types : []
  };
}

// Helper function to read and validate data
function readValidData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    return ensureValidData(parsedData);
  } catch (error) {
    console.error('Error reading podium data, initializing with default structure:', error);
    const defaultData = { items: [], types: [] };
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function GET() {
  try {
    const data = readValidData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading podium data:', error);
    return NextResponse.json({ error: 'Failed to read podium data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Handle type management
    if (data.action === 'deleteType' && data.typeName) {
      const currentData = readValidData();
      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => 
        item.type === data.typeName ? { ...item, type: '' } : item
      );
      
      const updatedData = {
        items: updatedItems,
        types: updatedTypes
      };
      
      fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    // Handle adding new type
    if (data.typeName && !data.name) {
      const currentData = readValidData();
      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
        return NextResponse.json({ success: true, type: { name: data.typeName } });
      } else {
        return NextResponse.json({ error: 'Type already exists' }, { status: 400 });
      }
    }
    
    // Handle regular item operations
    const currentData = readValidData();
    const updatedData = ensureValidData(data);
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing podium data:', error);
    return NextResponse.json({ error: 'Failed to write podium data' }, { status: 500 });
  }
} 