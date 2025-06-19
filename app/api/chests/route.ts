import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const chestsDataPath = path.join(process.cwd(), 'data', 'chests_database.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

if (!fs.existsSync(chestsDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(chestsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating chests_database.json:', error);
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chests_database.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chests:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'chests_database.json');
    const data = await request.json();
    
    // Handle type management
    if (data.action === 'deleteType' && data.typeName) {
      const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updatedTypes = currentData.types.filter((type: string) => type !== data.typeName);
      const updatedItems = currentData.items.map((item: any) => 
        item.type === data.typeName ? { ...item, type: '' } : item
      );
      
      const updatedData = {
        items: updatedItems,
        types: updatedTypes
      };
      
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    // Handle adding new type
    if (data.typeName && !data.name) {
      const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!currentData.types.includes(data.typeName)) {
        currentData.types.push(data.typeName);
        fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
        return NextResponse.json({ success: true, type: { name: data.typeName } });
      } else {
        return NextResponse.json({ error: 'Type already exists' }, { status: 400 });
      }
    }
    
    // Handle regular item operations
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving chests:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 