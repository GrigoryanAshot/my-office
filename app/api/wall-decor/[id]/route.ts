import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const wallDecorDataPath = path.join(process.cwd(), 'data', 'wall_decor_database.json');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!fs.existsSync(wallDecorDataPath)) {
      return NextResponse.json({ error: 'Wall decor data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(wallDecorDataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(id));
    if (!item) {
      return NextResponse.json({ error: 'Wall decor item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wall decor item' }, { status: 500 });
  }
} 