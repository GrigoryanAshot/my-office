import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const shelvingDataPath = path.join(process.cwd(), 'data', 'shelving_database.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

if (!fs.existsSync(shelvingDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(shelvingDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating shelving_database.json:', error);
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(shelvingDataPath)) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(shelvingDataPath, JSON.stringify(initialData, null, 2), 'utf8');
    }
    const data = fs.readFileSync(shelvingDataPath, 'utf8');
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (parseError) {
      const initialData = { items: [], types: [] };
      fs.writeFileSync(shelvingDataPath, JSON.stringify(initialData, null, 2), 'utf8');
      parsedData = initialData;
    }
    if (!parsedData || typeof parsedData !== 'object') parsedData = { items: [], types: [] };
    if (!Array.isArray(parsedData.items)) parsedData.items = [];
    if (!Array.isArray(parsedData.types)) parsedData.types = [];
    return NextResponse.json(parsedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read shelving data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Handle type management
    if (data.action === 'deleteType' && data.typeName) {
      const currentData = JSON.parse(fs.readFileSync(shelvingDataPath, 'utf8'));
      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => 
        item.type === data.typeName ? { ...item, type: '' } : item
      );
      
      const updatedData = {
        items: updatedItems,
        types: updatedTypes
      };
      
      fs.writeFileSync(shelvingDataPath, JSON.stringify(updatedData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    // Handle adding new type
    if (data.typeName && !data.name) {
      const currentData = JSON.parse(fs.readFileSync(shelvingDataPath, 'utf8'));
      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        fs.writeFileSync(shelvingDataPath, JSON.stringify(currentData, null, 2));
        return NextResponse.json({ success: true, type: { name: data.typeName } });
      } else {
        return NextResponse.json({ error: 'Type already exists' }, { status: 400 });
      }
    }
    
    // Handle regular item operations
    if (!data || typeof data !== 'object') return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    if (!Array.isArray(data.items)) return NextResponse.json({ error: 'Items must be an array' }, { status: 400 });
    if (!Array.isArray(data.types)) return NextResponse.json({ error: 'Types must be an array' }, { status: 400 });
    let currentData;
    try {
      const fileContent = fs.readFileSync(shelvingDataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      currentData = { items: [], types: [] };
    }
    const updatedData = {
      items: data.items,
      types: Array.from(new Set([...currentData.types, ...data.types]))
    };
    try {
      fs.writeFileSync(shelvingDataPath, JSON.stringify(updatedData, null, 2), 'utf8');
    } catch (error) {
      return NextResponse.json({ error: 'Failed to save data', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 