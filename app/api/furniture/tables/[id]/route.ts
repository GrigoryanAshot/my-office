import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const tablesDataPath = path.join(process.cwd(), 'data', 'tables_database.json');

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = fs.readFileSync(tablesDataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = parsed.items.find((item: any) => String(item.id) === params.id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 