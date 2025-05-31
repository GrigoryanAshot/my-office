import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'furniture_tables.json');

// Ensure data directory and file exist
const ensureDataFile = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
  }
};

export async function GET(request: Request) {
  try {
    ensureDataFile();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const items = JSON.parse(data);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const filteredItems = type ? items.filter((item: any) => item.type === type) : items;
    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Error reading items:', error);
    return NextResponse.json(
      { error: 'Failed to read items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    ensureDataFile();
    const { items } = await request.json();
    if (!items) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2), 'utf8');
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error saving items:', error);
    return NextResponse.json(
      { error: 'Failed to save items' },
      { status: 500 }
    );
  }
} 