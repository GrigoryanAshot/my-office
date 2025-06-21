import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const hangersDataPath = path.join(process.cwd(), 'data', 'hangers_database.json');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!fs.existsSync(hangersDataPath)) {
      return NextResponse.json({ error: 'Hangers data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(hangersDataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(id));
    if (!item) {
      return NextResponse.json({ error: 'Hanger not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hanger' }, { status: 500 });
  }
} 