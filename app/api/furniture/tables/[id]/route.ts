import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = path.join(process.cwd(), 'data', 'tables_database.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContents);
    
    const item = parsed.items.find((item: any) => String(item.id) === id);
    
    if (!item) {
      return new NextResponse('Item not found', { status: 404 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching table item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 