import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const poufsDataPath = path.join(process.cwd(), 'data', 'poufs_database.json');

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!fs.existsSync(poufsDataPath)) {
      return NextResponse.json({ error: 'Poufs data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(poufsDataPath, 'utf8');
    const parsed = JSON.parse(data);
    const item = (parsed.items || []).find((item: any) => String(item.id) === String(id));
    if (!item) {
      return NextResponse.json({ error: 'Pouf not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pouf' }, { status: 500 });
  }
} 