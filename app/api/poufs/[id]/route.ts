import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'poufs_database.json');

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return NextResponse.json({ error: 'Poufs data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pouf item' }, { status: 500 });
  }
} 