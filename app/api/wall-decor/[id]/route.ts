import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'wall_decor_database.json');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: 'Wall decor data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(params.id));
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wall decor item' }, { status: 500 });
  }
} 