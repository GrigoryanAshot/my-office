import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json');

export async function GET() {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { categories } = await request.json();
    
    // Ensure the data directory exists
    await fs.mkdir(path.dirname(CATEGORIES_FILE), { recursive: true });
    
    // Write the updated categories to the file
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
} 