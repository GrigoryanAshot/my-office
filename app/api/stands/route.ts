import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const standsDataPath = path.join(process.cwd(), 'data', 'stands_database.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

if (!fs.existsSync(standsDataPath)) {
  try {
    const initialData = { items: [], types: [] };
    fs.writeFileSync(standsDataPath, JSON.stringify(initialData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error creating stands_database.json:', error);
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'stands_database.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stands:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'stands_database.json');
    const data = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving stands:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 