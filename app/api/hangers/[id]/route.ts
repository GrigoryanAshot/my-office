import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'metal_metal_hangers_database.json');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: 'Hangers data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hanger item' }, { status: 500 });
  }
} 