import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(process.cwd(), 'data', 'metal_wall_decor_database.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const item = data.items.find((item: any) => String(item.id) === String(id));
    
    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching metal wall decor item:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 